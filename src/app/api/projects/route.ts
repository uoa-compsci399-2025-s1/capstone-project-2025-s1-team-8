import { NextRequest } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import ProjectService from '@/data-layer/services/ProjectService'

/**
 * Fetches all projects
 * @param req - The request object.
 */

export const GET = async (req: NextRequest): Promise<Response> => {
  const projectService = new ProjectService()
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '100')
  const { docs: projects, nextPage } = await projectService.getAllProjects(limit, page)
  return Response.json({ data: projects, nextPage })
}

/**
 * Creates a project by its ID..
 * @param req - The request object.
 */

export const POST = async (req: NextRequest): Promise<Response> => {
  const projectService = new ProjectService()

  try {
    const body = await req.json()
    const data = await projectService.createProject(body)
    return Response.json({ data }, { status: StatusCodes.CREATED })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Bad request body' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
