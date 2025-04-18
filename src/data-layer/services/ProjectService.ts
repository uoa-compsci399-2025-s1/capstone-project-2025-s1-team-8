import { Project } from '@/payload-types'
import { CreateProjectData, UpdateProjectData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { CreateSemesterProjectData, UpdateSemesterProjectData } from '@/types/Collections'
import { SemesterProject } from '@/payload-types'

export class ProjectService {
  /**
   * This function returns a list of all projects
   *
   * @returns The list of projects
   */
  public async getAllProjects(): Promise<Project[]> {
    const data = await payload.find({
      collection: 'project',
    })
    return data.docs
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
   * @returns The list of projects that the client is associated with
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
