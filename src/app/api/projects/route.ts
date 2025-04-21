import ProjectService from '@/data-layer/services/ProjectService'
import { NextRequest } from 'next/server'

/**
 * Fetches all projects
 * @param req - The request object.
 */

export const GET = async (req: NextRequest): Promise<Response> => {
  const projectService = new ProjectService()
  const searchParams = req.nextUrl.searchParams
  const clientId = searchParams.get('clientId')
  const name = searchParams.get('name')
  if (clientId){
   return Response.json({ data: await projectService.getProjectsByClientId(clientId) }) 
  } else if (name) {
    return Response.json({ data: await projectService.getProjectByName(name) })
  }
  return Response.json({ data: await projectService.getAllProjects() })
}
