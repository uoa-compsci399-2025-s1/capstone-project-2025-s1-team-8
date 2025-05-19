import type { PaginatedDocs } from 'payload';
import { NotFound } from 'payload'

import type { Project } from '@/payload-types'
import type { CreateProjectData, UpdateProjectData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import type { CreateSemesterProjectData, UpdateSemesterProjectData } from '@/types/Collections'
import type { SemesterProject } from '@/payload-types'
import type { ProjectStatus } from '@/types/Project'
import UserService from './UserService'

export default class ProjectService {
  /**
   * This function returns a paginated doc of all projects
   *
   * @param limit The number of projects to return
   * @param page The page number to return
   * @param options Optional filtering to search for client as well
   * @returns The list of projects
   */
  public async getAllProjects(
    limit: number = 100,
    page: number = 1,
    options?: {
      clientId: string
    },
  ): Promise<PaginatedDocs<Project>> {
    const data = await payload.find({
      collection: 'project',
      limit,
      pagination: true,
      page: page,
      where: {
        ...(!!options?.clientId
          ? {
              or: [
                {
                  client: {
                    equals: options.clientId,
                  },
                },
                {
                  additionalClients: {
                    contains: options.clientId,
                  },
                },
              ],
            }
          : {}),
      },
    })
    return data
  }

  /**
   * This function returns a project by its ID
   *
   * @param id The ID of the project
   * @returns The created project document
   */
  public async getProjectById(id: string): Promise<Project> {
    const data = await payload.findByID({
      collection: 'project',
      id,
    })
    return data
  }

  /**
   * This function returns a project by target name
   *
   * @param name The name of the project to search for
   * @returns The found project with target name
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

  /**
   * This function returns a list of all projects for a specific client
   *
   * @param clientId The ID of the client that the projects are associated with
   * @param limit The number of projects to return
   * @param page The page number to return
   * @returns The paginated doc of projects that the client is associated with
   */
  public async getProjectsByClientId(
    clientId: string,
    limit: number = 100,
    page: number = 1,
    options?: {
      published?: boolean
      status?: ProjectStatus
    },
  ): Promise<PaginatedDocs<Project>> {
    const userService = new UserService()
    try {
      await userService.getUser(clientId)
    } catch (error) {
      if (error instanceof NotFound) {
        throw new NotFound(() => {
          return 'User not found'
        })
      }
      throw error
    }
    const data = await payload.find({
      collection: 'project',
      where: {
        or: [
          {
            client: {
              equals: clientId,
            },
          },
          {
            additionalClients: {
              contains: clientId,
            },
          },
        ],
        ...(!!options?.published ? { published: { equals: options.published } } : {}),
        ...(!!options?.status ? { status: { equals: options.status } } : {}),
      },
      limit: limit,
      pagination: true,
      page: page,
    })
    return data
  }

  /**
   * This function creates a project
   *
   * @param data The project data
   * @returns The created project document
   */
  public async createProject(data: CreateProjectData): Promise<Project> {
    const project = await payload.create({
      collection: 'project',
      data,
    })
    return project
  }

  /**
   * This function updates a project
   *
   * @param {id} id The ID of the project
   * @param data The updated project data
   * @returns The updated project document
   */
  public async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const project = await payload.update({
      collection: 'project',
      id,
      data,
    })
    return project
  }

  /**
   * This function deletes a project by target ID
   *
   * @param id The ID of the project to delete
   */
  public async deleteProject(id: string): Promise<void> {
    await payload.delete({
      collection: 'project',
      id,
    })
  }

  /*
   * Semester Project Methods
   */

  /**
   * Creates a new semesterProject
   *
   * @param newSemesterProject The data for the new semesterProject
   * @returns The created semesterProject
   */
  public async createSemesterProject(
    newSemesterProject: CreateSemesterProjectData,
  ): Promise<SemesterProject> {
    const semesterProject = await payload.create({
      collection: 'semesterProject',
      data: newSemesterProject,
    })
    return semesterProject
  }

  /**
   * Retrieves a semesterProject object by ID
   *
   * @param id The ID of the semesterProject to retrieve
   * @returns The retrieved semesterProject object
   */
  public async getSemesterProject(id: string): Promise<SemesterProject> {
    const semesterProject = await payload.findByID({
      collection: 'semesterProject',
      id: id,
    })

    return semesterProject
  }

  /**
   * Retrieves all semesterProjects
   *
   * @returns An array of semesterProjects
   */
  public async getAllSemesterProjects(): Promise<SemesterProject[]> {
    const semesterProjects = await payload.find({
      collection: 'semesterProject',
    })
    return semesterProjects.docs
  }

  /**
   * Retrieves all semester projects by semester
   *
   * @param id The ID the the semester
   * @param limit The limit of projects to fetch
   * @param page The page to query
   * @param options Additional filtering params such as published or project status
   * @returns The paginated semester projects
   */
  public async getAllSemesterProjectsBySemester(
    id: string,
    limit: number = 100,
    page: number = 1,
    options?: {
      published?: boolean
      status?: ProjectStatus
    },
  ): Promise<PaginatedDocs<SemesterProject>> {
    return await payload.find({
      collection: 'semesterProject',
      limit,
      pagination: true,
      page: page,
      where: {
        semester: { equals: id },
        ...(!!options?.published ? { published: { equals: options.published } } : {}),
        ...(!!options?.status ? { status: { equals: options.status } } : {}),
      },
    })
  }

  /**
   * Method used to retrieve all {@link SemesterProject}'s that are related to a certain {@link Project}
   *
   * @param id The ID of the {@link Project} that's related to the {@link SemesterProject}'s returned
   * @returns A list of semester projects
   */
  public async getSemesterProjectsByProject(id: string): Promise<SemesterProject[]> {
    return (
      await payload.find({
        collection: 'semesterProject',
        pagination: false,
        where: {
          project: {
            equals: id,
          },
        },
      })
    ).docs
  }

  /**
   * Updates a semesterProject.
   *
   * @param id The semesterProject ID
   * @param semesterProject The updated semesterProject data object
   * @returns The updated semesterProject
   */
  public async updateSemesterProject(
    id: string,
    semesterProject: UpdateSemesterProjectData,
  ): Promise<SemesterProject> {
    const updatedSemesterProject = await payload.update({
      collection: 'semesterProject',
      id: id,
      data: semesterProject,
    })
    return updatedSemesterProject
  }

  /**
   * Deletes a semesterProject by ID
   *
   * @param id The semesterProject ID
   **/
  public async deleteSemesterProject(id: string): Promise<void> {
    await payload.delete({
      collection: 'semesterProject',
      id: id,
    })
  }
}
