import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'

import SemesterService from '@/data-layer/services/SemesterService'
import { UpdateSemesterRequestBody } from '@/types/request-models/SemesterRequests'
import { ZodError } from 'zod'
import { NotFound } from 'payload'

/**
 * Fetches a semester by its ID.
 *
 * @param param0 The ID of the semester to fetch
 * @returns The semester data
 */
export const GET = async (
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  },
) => {
  const { id } = await params
  const semesterService = new SemesterService()
  try {
    const semester = await semesterService.getSemester(id)
    return NextResponse.json({ data: semester })
  } catch {
    return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
  }
}

export const PATCH = async (
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  },
) => {
  const { id } = await params
  const semesterService = new SemesterService()
  try {
    const parsedBody = UpdateSemesterRequestBody.parse(await req.json())
    const semester = await semesterService.updateSemester(id, parsedBody)
    return NextResponse.json({ data: semester })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
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
