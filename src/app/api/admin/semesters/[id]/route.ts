import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { NotFound } from 'payload'
import { z, ZodError } from 'zod'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { Security } from '@/business-layer/middleware/Security'
import ProjectDataService from '@/data-layer/services/ProjectDataService'

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  deadline: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  startDate: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
})

class RouteWrapper {
  /**
   * PATCH method to update a semester.
   *
   * @param req The request object containing the request body
   * @param param1 The route parameters containing the semester ID
   * @returns The updated semester object
   */
  @Security('jwt', ['admin'])
  static async PATCH(
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const semesterDataService = new SemesterDataService()
    try {
      const parsedBody = UpdateSemesterRequestBody.parse(await req.json())
      const semester = await semesterDataService.updateSemester(id, parsedBody)
      return NextResponse.json({ data: semester })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      } else if (error instanceof NotFound)
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * DELETE method to delete a semester.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security('jwt', ['admin'])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const semesterDataService = new SemesterDataService()
    const projectDataService = new ProjectDataService()

    try {
      await semesterDataService.deleteSemester(id)

      const relatedProjects = await projectDataService.getAllSemesterProjectsBySemester(id)
      await Promise.all(
        relatedProjects.docs.map((semesterProject) =>
          projectDataService.deleteSemesterProject(semesterProject.id),
        ),
      )

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound)
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
