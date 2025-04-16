import { Project } from '@/payload-types'
import { CreateProject } from '@/types/CreateProject'
import { BasePayload, NotFound, PaginatedDocs } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export class ProjectService{
/*
 * This function returns a list of all projects
 * @param {payload} payload - The payload object
 * @returns {Promise<Project[]>} - An array of projects
 */
public static getAllProjects = async (): Promise<Project[]> => {
  const payload = await getPayload({
    config: configPromise,
  })
  const data: PaginatedDocs = await payload.find({
    collection: 'project',
  })
  return data.docs
}

/*
 * This function returns a project by its ID
 * @param {payload} payload - The payload object
 * @param {id} id - The ID of the project
 * @returns {Promise<Project | null>} - A project object or null if not found
 */
public static getProjectById = async (id: string): Promise<Project | null> => {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const data: Project | null = await payload.findByID({
      collection: 'project',
      id,
    })
    return data
  } catch (error) {
    if (error instanceof NotFound) {
      return null
    }
  }
  return null
}

/*
 * This function returns a project by its name
 * @param {name} name - The name of the project
 * @param {payload} payload - The payload object
 * @returns {Promise<Project | null>} - A project object or null if not found
 */
public static getProjectByName = async (
  name: string,
): Promise<Project | null> => {
  const payload = await getPayload({
    config: configPromise,
  })
  const data: Project | null = await payload.db.findOne({
    collection: 'project',
    where: {
      name: {
        equals: name,
      },
    },
  })
  return data
}

/*
 * This function returns a list of all projects for a specific client
 * @param {clientId} clientId - The ID of the client
 * @param {payload} payload - The payload object
 * @returns {Promise<Project[]>} - An array of projects
 */
public static getProjectsByClientId = async (
  clientId: string,
): Promise<Project[]> => {
  const payload = await getPayload({
    config: configPromise,
  })
  const data: PaginatedDocs = await payload.find({
    collection: 'project',
    where: {
      clients: {
        equals: clientId,
      },
    },
  })
  return data.docs
}

/*
 * This function creates a project
 * @param {payload} payload - The payload object
 * @param {data} data - The project data
 * @returns {Promise<Project>} - The created project object
 */
public static createProject = async (
  data: CreateProject,
): Promise<Project> => {
  const payload = await getPayload({
    config: configPromise,
  })
  const project: Project = await payload.create({
    collection: 'project',
    data,
  })
  return project
}

/*
 * This function updates a project
 * @param {payload} payload - The payload object
 * @param {id} id - The ID of the project
 * @param {data} data - The project data
 * @returns {Promise<Project | null>} - The updated project object or null if not found
 */
public static updateProject = async (
  id: string,
  data: CreateProject,
): Promise<Project | null> => {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const findProject: Project | null = await payload.findByID({
      collection: 'project',
      id,
    })
  } catch (error) {
    if (error instanceof NotFound) {
      return null
    }
  }
  const project: Project = await payload.update({
    collection: 'project',
    id,
    data,
  })
  return project
}
/*
 * This function updates a project
 * @param {payload} payload - The payload object
 * @param {id} id - The ID of the project
 * @param {data} data - The partial project data
 * @returns {Promise<Project | null >} - The updated project object or null if not found
 */
public static patchProject = async (
  id: string,
  data: Partial<CreateProject>,
): Promise<Project | null> => {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const findProject: Project | null = await payload.findByID({
      collection: 'project',
      id,
    })
  } catch (error) {
    if (error instanceof NotFound) {
      return null
    }
  }
  const project: Project = await payload.update({
    collection: 'project',
    id,
    data,
  })
  return project
}

/*
 * This function updates a project
 * @param {payload} payload - The payload object
 * @param {id} id - The ID of the project
 * @returns {Promise<Project | null >} - The deleted project object or null if not found
 */
public static deleteProject = async (id: string): Promise<Project | null> => {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const findProject: Project | null = await payload.findByID({
      collection: 'project',
      id,
    })
  } catch (error) {
    if (error instanceof NotFound) {
      return null
    }
  }
  const project: Project = await payload.delete({
    collection: 'project',
    id,
  })
  return project
}
}

