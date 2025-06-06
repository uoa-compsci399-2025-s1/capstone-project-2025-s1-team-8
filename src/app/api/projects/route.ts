import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import type { CreateProjectData } from '@/types/Collections'
import { z, ZodError } from 'zod'
import { Security } from '@/business-layer/middleware/Security'
import { MediaSchema, ProjectSchema } from '@/types/Payload'
import type { RequestWithUser } from '@/types/Requests'
import { UserRole, UserRoleWithoutAdmin } from '@/types/User'
import type { Semester, User } from '@/payload-types'
import UserDataService from '@/data-layer/services/UserDataService'
import { NotFound } from 'payload'
import { CommonResponse } from '@/types/response-models/CommonResponse'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { ProjectStatus } from '@/types/Project'

export const CreateProjectClientSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string(),
})
export type CreateProjectClient = z.infer<typeof CreateProjectClientSchema>

export const CreateProjectRequestBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  additionalClients: z.array(CreateProjectClientSchema).optional(),
  attachments: z.optional(z.array(MediaSchema).max(5)),
  deadline: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  semesters: z.array(z.string()),
  desiredOutput: z.string(),
  specialEquipmentRequirements: z.string(),
  numberOfTeams: z.string(),
  desiredTeamSkills: z.string().optional(),
  availableResources: z.string().optional(),
})
export type CreateProjectRequestBody = z.infer<typeof CreateProjectRequestBodySchema>

export const CreateProjectResponseSchema = CommonResponse.extend({
  data: ProjectSchema.optional(),
})
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>

class RouteWrapper {
  /**
   * Fetches all projects
   *
   * @param req - The request object.
   * @returns A JSON response containing the list of projects and the next page cursor.
   */
  @Security('jwt', ['client', 'admin'])
  static async GET(req: RequestWithUser) {
    const projectDataService = new ProjectDataService()

    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    if (limit > 100 || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    let docs, nextPage
    if (req.user.role === UserRole.Admin) {
      ;({ docs, nextPage } = await projectDataService.getAllProjects(limit, page))
    } else {
      ;({ docs, nextPage } = await projectDataService.getAllProjects(limit, page, {
        clientId: req.user.id,
      }))
    }
    return NextResponse.json({ data: docs, nextPage })
  }

  /**
   * Creates a project by its ID.
   *
   * @param req - The request object.
   * @returns A JSON response containing the created project.
   */
  @Security('jwt', ['client', 'admin'])
  static async POST(req: RequestWithUser) {
    const projectDataService = new ProjectDataService()
    const semesterDataService = new SemesterDataService()
    const userService = new UserDataService()

    try {
      const body = CreateProjectRequestBodySchema.parse(await req.json())

      const clients: User[] = await Promise.all(
        body.additionalClients?.map(async ({ firstName, lastName, email }) => {
          try {
            return await userService.getUserByEmail(email)
          } catch (err) {
            if (err instanceof NotFound) {
              return await userService.createUser({
                firstName,
                lastName,
                email,
                role: UserRoleWithoutAdmin.Client,
              })
            } else {
              throw err
            }
          }
        }) || [],
      )

      const semesters: Semester[] = await Promise.all(
        body.semesters?.map(async (semesterID) => {
          try {
            return await semesterDataService.getSemester(semesterID)
          } catch (err) {
            throw err
          }
        }),
      )

      const createdProject = await projectDataService.createProject({
        ...body,
        client: req.user.id,
        additionalClients: clients,
      } as CreateProjectData)

      await Promise.all(
        semesters.map(async (semester) => {
          return await projectDataService.createSemesterProject({
            project: createdProject,
            semester,
            status: ProjectStatus.Pending,
          })
        }),
      )

      return NextResponse.json({ data: createdProject } as CreateProjectResponse, {
        status: StatusCodes.CREATED,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() } as CreateProjectResponse,
          { status: StatusCodes.BAD_REQUEST },
        )
      } else if (error instanceof NotFound) {
        return NextResponse.json(
          {
            error: 'Invalid request body, one or more semesters are invalid',
          } as CreateProjectResponse,
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) } as CreateProjectResponse,
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      )
    }
  }
}

export const GET = RouteWrapper.GET,
  POST = RouteWrapper.POST
