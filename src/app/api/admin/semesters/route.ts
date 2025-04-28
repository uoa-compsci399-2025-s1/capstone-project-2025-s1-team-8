import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import SemesterService from '@/data-layer/services/SemesterService'
import { CreateSemesterData } from '@/types/Collections'
import { CreateSemesterRequestBody } from '@/types/request-models/SemesterRequests'
import { ZodError } from 'zod'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * POST Method to create a new semester.
   *
   * @param req The request object containing the request body
   * @returns The created semester.
   */
  @Security('jwt', ['admin'])
  static async POST(req: NextRequest) {
    try {
      const parsedBody = CreateSemesterRequestBody.parse(await req.json())

      const semesterService = new SemesterService()
      const newSemester = await semesterService.createSemester(parsedBody as CreateSemesterData)

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
          { error: 'Internal server error' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }
  }
}

export const POST = RouteWrapper.POST
