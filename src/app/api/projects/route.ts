import { Project } from '@/payload-types'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import {
  createProject,
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
  const payload = await getPayload({
    config: configPromise,
  })

  const params: URLSearchParams = req.nextUrl.searchParams
  let projects: Array<Project>
  //console.log(params.size)
  //console.log(params)
  if ('clientID' in params) {
    projects = await getProjectsByClientId(payload, params.get('clientID') as string)
  } else if ('name' in params) {
    projects = []
    const project: Project | null = await getProjectByName(payload, params.get('name') as string)
    if (project) projects.push(project)
  } else {
    projects = await getAllProjects(payload)
  }

  return Response.json(projects, { status: 200 })
}

/*
 * This function creates a new project
 * @param {req} req - The request object
 * returns {Promise<Response>} - The created project object or an error response
 */
export const POST = async (req: NextRequest): Promise<Response> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data: Project = await req.json()

  //console.log('data', data)
  try {
    const project: Project = await createProject(payload, data)
    return Response.json(project, { status: 201 })
  } catch (error) {
    return Response.json(error, { status: 500 })
  }
}
