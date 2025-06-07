import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { z, ZodError } from 'zod'
import { Security } from '@/business-layer/middleware/Security'

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
  startDate: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
  endDate: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
})

class RouteWrapper {
  /**
   * POST Method to create a new semester.
   *
   * @param req The request object containing the request body
   * @returns The created semester.
   */
  @Security('jwt', ['admin'])
  static async POST(req: NextRequest) {
    const semesterDataService = new SemesterDataService()
    try {
      const parsedBody = CreateSemesterRequestBody.parse(await req.json())

      const newSemester = await semesterDataService.createSemester({
        ...parsedBody,
        published: false,
      })

      return NextResponse.json({ data: newSemester }, { status: StatusCodes.CREATED })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      } else {
        console.error(error)
        return NextResponse.json(
          { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }
  }
}

export const POST = RouteWrapper.POST
