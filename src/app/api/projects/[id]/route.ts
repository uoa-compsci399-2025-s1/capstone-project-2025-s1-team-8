import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { NotFound } from 'payload'
import { z, ZodError } from 'zod'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { Security } from '@/business-layer/middleware/Security'
import type { RequestWithUser } from '@/types/Requests'
import { MediaSchema, UserSchema } from '@/types/Payload'
import { UserRole } from '@/types/User'
import type { Semester, User } from '@/payload-types'
import type { CreateSemesterProjectData } from '@/types/Collections'
import { ProjectStatus } from '@/types/Project'
import SemesterService from '@/data-layer/services/SemesterDataService'

export const UpdateProjectRequestBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  clients: z
    .union([
      z.array(z.string()).nonempty('At least one client is required'),
      z.array(UserSchema).nonempty('At least one client is required'),
    ])
    .optional(),
  attachments: z.array(MediaSchema).max(5).optional(),
  desiredOutput: z.string().optional(),
  desiredTeamSkills: z.string().optional(),
  availableResources: z.string().optional(),
  specialEquipmentRequirements: z.string().optional(),
  numberOfTeams: z.string().optional(),
  futureConsideration: z.boolean().optional(),
  semesters: z.array(z.string()).optional(),
})
export type UpdateProjectRequestBody = z.infer<typeof UpdateProjectRequestBodySchema>

class RouteWrapper {
  /**
   * Fetches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async GET(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()
    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      return NextResponse.json({
        data: project,
        // data: {
        //   ...fetchedForm,
        //   ...fetchedForm.questionResponses?.reduce(
        //     (acc, curr) => {
        //       if (curr.question instanceof Object) {
        //         acc[curr.question.fieldName] = curr
        //       }
        //       return acc
        //     },
        //     {} as Record<string, QuestionResponse>,
        //   ),
        // },
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Patches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async PATCH(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()
    const semesterDataService = new SemesterService()
    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      const body = UpdateProjectRequestBodySchema.parse(await req.json())
      const data = await projectDataService.updateProject(id, body)
      // handle creating semester project
      if (body.semesters) {
        // @TODO it created sem proj in a sem that already exists
        // get all semester projects of this project
        const existingSemesterProjects = await projectDataService.getSemesterProjectsByProject(id)
        // go through all selected semesters in form data, and create a semester project if it doesn't exist
        for (const selectedSemester of body.semesters) {
          const semesterProjectExists = (existingSemesterProjects || []).some(
            (existingSemesterProjects) => {
              return (existingSemesterProjects.semester as Semester).id === selectedSemester
            },
          )
          if (!semesterProjectExists) {
            const semester = await semesterDataService.getSemester(selectedSemester)
            const semesterProject = await projectDataService.createSemesterProject({
              project: data,
              status: ProjectStatus.Pending,
              published: false,
              semester: semester,
            } as CreateSemesterProjectData)
            if (!semesterProject) {
              console.error('Failed to create semester project for', selectedSemester)
              return NextResponse.json(
                { error: 'Failed to create semester project' },
                { status: StatusCodes.INTERNAL_SERVER_ERROR },
              )
            }
          }
        }
      }
      return NextResponse.json({ data: data })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Deletes a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async DELETE(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()

    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      await projectDataService.deleteProject(id)
      const semesterProjects = await projectDataService.getSemesterProjectsByProject(id)
      for (const semesterProject of semesterProjects) {
        await projectDataService.deleteSemesterProject(semesterProject.id)
      }
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET,
  PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
