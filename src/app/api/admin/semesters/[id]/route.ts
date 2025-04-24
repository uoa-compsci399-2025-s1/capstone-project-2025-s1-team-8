import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { NotFound } from 'payload'
import { ZodError } from 'zod'

import SemesterService from '@/data-layer/services/SemesterService'
import { UpdateSemesterRequestBody } from '@/types/request-models/SemesterRequests'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * PATCH method to update a semester.
   *
   * @param req The request object containing the request body
   * @param param1 The route parameters containing the semester ID
   * @returns The updated semester object
   */
   @Security("jwt", ['admin'])
  static async PATCH(
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ){
    const { id } = await params
    const semesterService = new SemesterService()
    try {
      const parsedBody = UpdateSemesterRequestBody.parse(await req.json())
      const semester = await semesterService.updateSemester(id, parsedBody)
      return NextResponse.json({ data: semester })
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      } else if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      } else {
        console.error(error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }
  }

  /**
   * DELETE method to delete a semester.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security("jwt", ['admin'])
  static async DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const { id } = await params
      const semesterService = new SemesterService()
      await semesterService.deleteSemester(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
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

export const PATCH = RouteWrapper.PATCH, DELETE = RouteWrapper.DELETE
