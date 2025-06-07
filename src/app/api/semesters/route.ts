import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import SemesterDataService from '@/data-layer/services/SemesterDataService'
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
    const timeframe = (searchParams.get('timeframe') || SemesterType.Default) as SemesterType
    if (!Object.values(SemesterType).includes(timeframe)) {
      return NextResponse.json(
        { error: 'Invalid timeframe provided' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    const semesterDataService = new SemesterDataService()
    const semesters = await semesterDataService.getAllSemesters(timeframe)
    return NextResponse.json({ data: semesters })
  }
}

export const GET = RouteWrapper.GET
