import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'

import SemesterService from '@/data-layer/services/SemesterService'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * Fetches a semester by its ID.
   *
   * @param param0 The ID of the semester to fetch
   * @returns The semester data
   */
  @Security('jwt', [])
  static async GET(
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const semesterService = new SemesterService()
    try {
      const semester = await semesterService.getSemester(id)
      return NextResponse.json({ data: semester })
    } catch {
      return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
    }
  }
}

export const GET = RouteWrapper.GET
