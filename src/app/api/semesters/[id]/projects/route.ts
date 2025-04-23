import { NextRequest, NextResponse } from 'next/server'
import ProjectService from '@/data-layer/services/ProjectService'
import { StatusCodes } from 'http-status-codes'
import { ProjectStatus } from '@/types/Project'

/**
 * Fetches all projects for a semester
 * @param req - The request object.
 * @param params - The parameters object containing the semester ID.
 * @returns A JSON response containing the list of projects and the next page cursor.
 */

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  const { id } = await params
  const projectService = new ProjectService()
  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get('status')
  const published = searchParams.get('published')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '100')

  if (limit > 100 || limit < 1) {
    return NextResponse.json(
      { error: 'Limit must be between 1 and 100' },
      { status: StatusCodes.BAD_REQUEST },
    )
  }
  if (status !== null && !Object.values(ProjectStatus).includes(status as ProjectStatus)) {
    return NextResponse.json({ error: 'Status is not valid' }, { status: StatusCodes.BAD_REQUEST })
  }

  if (published !== null && published !== 'true' && published !== 'false') {
    return NextResponse.json(
      { error: 'Published must be true or false' },
      { status: StatusCodes.BAD_REQUEST },
    )
  }

  if (published !== null && status !== null) {
    const { docs: projects, nextPage } =
      await projectService.getSemesterProjectsByPublishedAndStatus(
        id,
        JSON.parse(published),
        status as ProjectStatus,
        limit,
        page,
      )
    return NextResponse.json({ data: projects, nextPage })
  } else if (published !== null) {
    const { docs: projects, nextPage } = await projectService.getSemesterProjectsByPublished(
      id,
      JSON.parse(published),
      limit,
      page,
    )
    return NextResponse.json({ data: projects, nextPage })
  } else if (status !== null) {
    const { docs: projects, nextPage } = await projectService.getSemesterProjectsByStatus(
      id,
      status as ProjectStatus,
      limit,
      page,
    )
    return NextResponse.json({ data: projects, nextPage })
  }

  const { docs: projects, nextPage } = await projectService.getSemesterProjectsBySemesterId(
    id,
    limit,
    page,
  )
  return NextResponse.json({ data: projects, nextPage })
}
