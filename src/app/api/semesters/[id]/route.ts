import { StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { Security } from '@/business-layer/middleware/Security'
import { NotFound } from 'payload'

class RouteWrapper {
  /**
   * Fetches a semester by its ID.
   *
   * @param param0 The ID of the semester to fetch
   * @returns The semester data
   */
  @Security('jwt')
  static async GET(
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const semesterDataService = new SemesterDataService()
    try {
      const semester = await semesterDataService.getSemester(id)
      return NextResponse.json({ data: semester })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Bad request body' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
