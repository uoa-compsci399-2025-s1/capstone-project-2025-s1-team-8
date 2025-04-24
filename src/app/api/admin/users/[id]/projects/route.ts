import { NextRequest, NextResponse } from 'next/server'
import ProjectService from '@/data-layer/services/ProjectService'
import { StatusCodes } from 'http-status-codes'

/**
 * Fetches all projects
 * @param req - The request object.
 * @param params - The parameters object containing the user ID.
 * @returns A JSON response containing the list of projects and the next page cursor.
 */

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const projectService = new ProjectService()
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '100')
  if (limit > 100 || limit < 1) {
    return NextResponse.json(
      { error: 'Limit must be between 1 and 100' },
      { status: StatusCodes.BAD_REQUEST },
    )
  }
  const { docs: projects, nextPage } = await projectService.getProjectsByClientId(id, limit, page)
  return NextResponse.json({ data: projects, nextPage })
}
