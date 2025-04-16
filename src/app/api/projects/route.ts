import { Project } from '@/payload-types'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectByName,
  getProjectsByClientId,
} from '../../services/ProjectServices'

/*
 * This function retrieves a list of projects based on query parameters
 * @param {req} req - The request object
 * returns {Promise<Response>} - A list of projects or an error response
 */
export const GET = async (req: NextRequest): Promise<Response> => {

  const params: URLSearchParams = req.nextUrl.searchParams
  let projects: Array<Project>
  if ('clientID' in params) {
    projects = await getProjectsByClientId(params.get('clientID') as string)
  } else if ('name' in params) {
    projects = []
    const project: Project | null = await getProjectByName(params.get('name') as string)
    if (project) projects.push(project)
  } else {
    projects = await getAllProjects()
  }

  return Response.json(projects, { status: 200 })
}

/*
 * This function creates a new project
 * @param {req} req - The request object
 * @returns {Promise<Response>} - The created project object or an error response
 */
export const POST = async (req: NextRequest): Promise<Response> => {

  const data: Project = await req.json()

  try {
    const project: Project = await createProject(data)
    return Response.json(project, { status: 201 })
  } catch (error) {
    return Response.json(error, { status: 500 })
  }
}

/*
 * This function deletes all projects
 * @returns {Promise<Response>} - Status 204 for deleted
 */
export const DELETE = async (): Promise<Response> => {

  const projects: Array<Project> = await getAllProjects()
  for (const project of projects) {
    await deleteProject(project.id)
  }
  return Response.json({ status: 204 })
}
