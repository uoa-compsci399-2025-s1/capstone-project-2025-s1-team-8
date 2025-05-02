import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import ProjectService from '@/data-layer/services/ProjectService'
import { CreateProjectData } from '@/types/Collections'
import { z, ZodError } from 'zod'
import { Security } from '@/business-layer/middleware/Security'
import { FormResponseSchema, MediaSchema, UserSchema } from '@/types/Payload'

export const CreateProjectRequestBody = z.object({
  name: z.string(),
  description: z.string(),
  deadline: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  timestamp: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
  clients: z.union([
    z.array(z.string()).nonempty('At least one client is required'),
    z.array(UserSchema).nonempty('At least one client is required'),
  ]),
  attachments: z.array(MediaSchema).max(5).optional(),
  formResponse: z.union([z.string(), FormResponseSchema]),
})

class RouteWrapper {
  /**
   * Fetches all projects
   *
   * @param req - The request object.
   * @returns A JSON response containing the list of projects and the next page cursor.
   */
  @Security('jwt', ['client', 'admin'])
  static async GET(req: NextRequest) {
    const projectService = new ProjectService()
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    if (limit > 100 || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    const { docs: projects, nextPage } = await projectService.getAllProjects(limit, page)
    return NextResponse.json({ data: projects, nextPage })
  }

  /**
   * Creates a project by its ID.
   *
   * @param req - The request object.
   * @returns A JSON response containing the created project.
   */
  @Security('jwt', ['client', 'admin'])
  static async POST(req: NextRequest) {
    const projectService = new ProjectService()

    try {
      const body = CreateProjectRequestBody.parse(await req.json())
      const data = await projectService.createProject(body as CreateProjectData)
      return NextResponse.json({ data }, { status: StatusCodes.CREATED })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Bad request body' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET,
  POST = RouteWrapper.POST
