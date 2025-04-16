import { NextRequest } from 'next/server'
import { ProjectService } from '@/data-layer/services/ProjectService'
import { Project } from '@/payload-types'

const projectService = new ProjectService()
/*
 * This function retrieves a project by ID
 * @param {projectId} projectId - The ID of the project
 * returns {Promise<Response>} - The project object or an error response
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: { projectId: string } },
): Promise<Response> => {
  const { projectId } = await params
  const data: Project | null = await projectService.getProjectById(projectId)
  if (!data) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }
  return Response.json(data)
}

/*
 * This function deletes a project by ID
 * @param {projectId} projectId - The ID of the project
 * returns {Promise<Response>} - The project object or an error response
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { projectId: string } },
): Promise<Response> => {
  const { projectId } = await params
  const project: Project | null = await projectService.deleteProject(projectId)
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }
  return Response.json({ status: 204 })
}

/*
 * This function updates a partial project by ID
 * @param {projectId} projectId - The ID of the project
 * @returns {Promise<Response>} - The project object or an error response
 */
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { projectId: string } },
): Promise<Response> => {
  const { projectId } = await params
  const data: Partial<Project> = await req.json()
  const project: Project | null = await projectService.patchProject(projectId, data)
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }
  return Response.json(project, { status: 201 })
}

/*
 * This function updates a project by ID
 * @param {projectId} projectId - The ID of the project
 * @returns {Promise<Response>} - The project object or an error response
 */
export const PUT = async (
  req: NextRequest,
  { params }: { params: { projectId: string } },
): Promise<Response> => {
  const { projectId } = await params
  const data: Project = await req.json()
  const project: Project | null = await projectService.updateProject(projectId, data)
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }
  return Response.json(project, { status: 201 })
}
