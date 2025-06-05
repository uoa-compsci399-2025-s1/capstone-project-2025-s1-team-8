import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { z, ZodError } from 'zod'
import { NotFound } from 'payload'

import ProjectDataService from '@/data-layer/services/ProjectDataService'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { ProjectStatus } from '@/types/Project'
import type { CreateSemesterProjectData } from '@/types/Collections'
import { Security } from '@/business-layer/middleware/Security'
import type { RequestWithUser } from '@/types/Requests'
import { UserRole } from '@/types/User'
import type { SemesterProject } from '@/payload-types'
import { ProjectSchema } from '@/types/Payload'

export const CreateSemesterProjectRequestBodySchema = z.object({
  number: z.number().min(1).nullable().optional(),
  project: z.union([z.string(), ProjectSchema]),
  status: z.nativeEnum(ProjectStatus),
  published: z.boolean(),
})
export type CreateSemesterProjectRequestBody = z.infer<
  typeof CreateSemesterProjectRequestBodySchema
>

class RouterWrapper {
  /**
   * Fetches all projects for a semester
   *
   * @param req The request object.
   * @param params The parameters object containing the semester ID.
   * @returns A JSON response containing the list of projects and the next page cursor.
   */
  @Security('jwt', ['student', 'admin'])
  static async GET(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const published = searchParams.get('published')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (limit > 100 || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    if (status !== null && !Object.values(ProjectStatus).includes(status as ProjectStatus)) {
      return NextResponse.json(
        { error: 'Status is not valid' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    if (published !== null && published !== 'true' && published !== 'false') {
      return NextResponse.json(
        { error: 'Published must be true or false' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    let docs: SemesterProject[], nextPage: number | null | undefined

    if (req.user.role === UserRole.Student) {
      const paginatedProjects = await projectDataService.getAllSemesterProjectsBySemester(
        id,
        limit,
        page,
        {
          published: true,
          status: status ? (status as ProjectStatus) : undefined,
        },
      )
      docs = paginatedProjects.docs
      nextPage = paginatedProjects.nextPage
    } else {
      const paginatedProjects = await projectDataService.getAllSemesterProjectsBySemester(
        id,
        limit,
        page,
        {
          published: !!published ? JSON.parse(published) : undefined,
          status: status ? (status as ProjectStatus) : undefined,
        },
      )
      docs = paginatedProjects.docs
      nextPage = paginatedProjects.nextPage
    }

    return NextResponse.json({ data: docs, nextPage })
  }

  /**
   * Creates a new project for a semester
   *
   * @param req The request object.
   * @param params The parameters object containing the semester ID.
   * @return A JSON response containing the created semester project.
   */
  @Security('jwt', ['admin', 'client'])
  static async POST(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const projectDataService = new ProjectDataService()
    const semesterDataService = new SemesterDataService()
    const { id } = await params

    try {
      const semester = await semesterDataService.getSemester(id)
      const bodyData = await req.json()
      const body = CreateSemesterProjectRequestBodySchema.parse(bodyData)
      try {
        const project = await projectDataService.getProjectById(
          typeof body.project === 'string' ? body.project : body.project?.id,
        )
        if (
          req.user.role !== UserRole.Admin &&
          project.client !== req.user.id &&
          !project.additionalClients?.includes(req.user.id)
        ) {
          return NextResponse.json(
            { error: 'The project is not associated with the user' },
            { status: StatusCodes.UNAUTHORIZED },
          )
        }
      } catch (error) {
        if (error instanceof NotFound) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: StatusCodes.NOT_FOUND },
          )
        }
      }

      const data = await projectDataService.createSemesterProject({
        ...body,
        semester: semester,
      } as CreateSemesterProjectData)
      return NextResponse.json({ data }, { status: StatusCodes.CREATED })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      } else if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error('Error', error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouterWrapper.GET,
  POST = RouterWrapper.POST
