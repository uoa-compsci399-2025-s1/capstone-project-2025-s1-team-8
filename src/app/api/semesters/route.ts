import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import SemesterService from '@/data-layer/services/SemesterService'
import { Security } from '@/business-layer/middleware/Security'
import { SemesterType } from '@/types/Semester'

class RouteWrapper {
  /**
   * GET Method to get semesters.
   *
   * @param req The request object
   * @returns All semesters.
   */
  @Security('jwt')
  static async GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const timeframe = (searchParams.get('timeframe') || SemesterType.Default) as SemesterType
    if (limit < 0 || limit > 100) {
      return NextResponse.json({ error: 'Invalid page number' }, { status: StatusCodes.NOT_FOUND })
    }
    const semesterService = new SemesterService()
    const { docs: semester, nextPage } = await semesterService.getAllSemesters(
      limit,
      page,
      timeframe,
    )
    return NextResponse.json({ data: semester, nextPage })
  }
}

export const GET = RouteWrapper.GET
