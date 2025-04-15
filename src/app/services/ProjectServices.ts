import { Project } from '@/payload-types'
import { BasePayload, NotFound, PaginatedDocs } from 'payload'

/*
 * This function returns a list of all projects
 * @param {payload} payload - The payload object
 * @returns {Promise<Array<Project>>} - An array of projects
 */
export const getAllProjects = async (payload: BasePayload): Promise<Array<Project>> => {
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
export const getProjectById = async (payload: BasePayload, id: string): Promise<Project | null> => {
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
export const getProjectByName = async (
  payload: BasePayload,
  name: string,
): Promise<Project | null> => {
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
 * @returns {Promise<Array<Project>>} - An array of projects
 */
export const getProjectsByClientId = async (
  payload: BasePayload,
  clientId: string,
): Promise<Array<Project>> => {
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
export const createProject = async (payload: BasePayload, data: Project): Promise<Project> => {
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
export const updateProject = async (
  payload: BasePayload,
  id: string,
  data: Project,
): Promise<Project | null> => {
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
export const patchProject = async (
  payload: BasePayload,
  id: string,
  data: Partial<Project>,
): Promise<Project | null> => {
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
export const deleteProject = async (payload: BasePayload, id: string): Promise<Project | null> => {
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
