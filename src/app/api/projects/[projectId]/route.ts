import configPromise from '@payload-config'
import {
  getProjectById,
  deleteProject,
  patchProject,
  updateProject,
} from '../../../services/ProjectServices'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import { Project } from '@/payload-types'

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
  const data: Project | null = await getProjectById(projectId)
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
  const project: Project | null = await deleteProject(projectId)
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
  const project: Project | null = await patchProject(projectId, data)
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
  const project: Project | null = await updateProject(projectId, data)
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }
  return Response.json(project, { status: 201 })
}
