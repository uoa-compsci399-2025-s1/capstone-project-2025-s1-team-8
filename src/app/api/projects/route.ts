import ProjectService from '@/data-layer/services/ProjectService'
import { NextRequest } from 'next/server'

/**
 * Fetches all projects
 * @param req - The request object.
 */

export const GET = async (req: NextRequest): Promise<Response> => {
  const projectService = new ProjectService()
  const searchParams = req.nextUrl.searchParams
  const name = searchParams.get('name')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '100')
  if (name) {
    return Response.json({ data: await projectService.getProjectByName(name) })
  }
  return Response.json({ data: await projectService.getAllProjects(limit, page) })
}
