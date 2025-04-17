import { CreateSemesterProjectData, UpdateSemesterProjectData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { SemesterProject } from '@/payload-types'
import { ProjectStatus } from '@/types/Project'
import { Semester } from '@/payload-types'

export class SemesterProjectService {
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
    Retrieves all SemesterProjects by Status
    * @param status The status of the semesterProjects to retrieve
    * @returns An array of semesterProjects with the specified status
    **/
  public async filterSemesterProjectsByStatus(
    status: ProjectStatus,
    projects: SemesterProject[],
  ): Promise<SemesterProject[]> {
    let semesterProjects = []
    for (const project of projects) {
      if (project.status === status) {
        semesterProjects.push(project)
      }
    }
    return semesterProjects
  }

  /**
   * Filters a list of semesterProjects by semester ID
   * @param projects The array of semesterProjects to filter
   * @param id The semester ID
   * @returns An array of semesterProjects associated with the specified semester ID
   */
  public async filterProjectsBySemester(
    id: string,
    projects: SemesterProject[],
  ): Promise<SemesterProject[]> {
    let semesterProjects = []
    for (const project of projects) {
      if (typeof project.semester === 'string') {
        if (project.semester === id) {
          semesterProjects.push(project)
        }
      } else {
        const semester = project.semester as Semester
        if (semester.id === id) {
          semesterProjects.push(project)
        }
      }
    }
    return semesterProjects
  }

  /**
   * Retrieves all semesterProjects by publish status
   * @param published The publish status
   * @returns An array of semesterProjects with the specified publish status
   */
  public async filterSemesterProjectsByPublished(
    published: boolean,
    projects: SemesterProject[],
  ): Promise<SemesterProject[]> {
    let semesterProjects = []
    for (const project of projects) {
      if (project.published === published) {
        semesterProjects.push(project)
      }
    }
    return semesterProjects
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
