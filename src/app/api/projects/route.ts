import { NextRequest } from 'next/server'
import ProjectService from '@/data-layer/services/ProjectService'

/**
 * Fetches all projects
 * @param req - The request object.
 */

export const GET = async (req: NextRequest): Promise<Response> => {
  const projectService = new ProjectService()
  return Response.json({ data: await projectService.getAllProjects() })
}
