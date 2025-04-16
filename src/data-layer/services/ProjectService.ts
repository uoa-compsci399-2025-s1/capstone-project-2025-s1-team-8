import { Project } from '@/payload-types'
import { CreateProjectData, UpdateProjectData } from '@/types/Collections'
import { NotFound } from 'payload'
import { payload } from '../adapters/Payload'

export class ProjectService {
  /*
   * This function returns a list of all projects
   */
  public async getAllProjects(): Promise<Project[]> {
    const data = await payload.find({
      collection: 'project',
    })
    return data.docs
  }

  /*
   * This function returns a project by its ID
   * @param {id} id - The ID of the project
   */
  public async getProjectById(id: string): Promise<Project> {
    const data = await payload.findByID({
      collection: 'project',
      id,
    })
    return data
  }

  /*
   * This function returns a project by its name
   * @param {name} name - The name of the project
   */
  public async getProjectByName(name: string): Promise<Project> {
    const data = await payload.find({
      collection: 'project',
      where: {
        name: {
          equals: name,
        },
      },
    })
    return data.docs[0]
  }

  /*
   * This function returns a list of all projects for a specific client
   * @param {clientId} clientId - The ID of the client
   */
  public async getProjectsByClientId(clientId: string): Promise<Project[]> {
    const data = await payload.find({
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
   * @param {data} data - The project data
   */
  public async createProject(data: CreateProjectData): Promise<Project> {
    const project: Project = await payload.create({
      collection: 'project',
      data,
    })
    return project
  }

  /*
   * This function updates a project
   * @param {id} id - The ID of the project
   * @param {data} data - The project data
   */
  public async updateProject(id: string, data: CreateProjectData): Promise<Project> {
    const project: Project = await payload.update({
      collection: 'project',
      id,
      data,
    })
    return project
  }
  /*
   * This function patches a project
   * @param {id} id - The ID of the project
   * @param {data} data - The partial project data
   */
  public async patchProject(id: string, data: UpdateProjectData): Promise<Project> {
    const project: Project = await payload.update({
      collection: 'project',
      id,
      data,
    })
    return project
  }

  /*
   * This function updates a project
   * @param {id} id - The ID of the project
   */
  public async deleteProject(id: string): Promise<void> {
    await payload.delete({
      collection: 'project',
      id,
    })
  }
}
