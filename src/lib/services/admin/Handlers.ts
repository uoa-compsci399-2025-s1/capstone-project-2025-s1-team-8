'use server'

import type { UserCombinedInfo } from '@/types/Collections'
import AdminService from 'src/lib/services/admin/index'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import type { typeToFlattenedError } from 'zod'
import type { Project, Semester } from '@/payload-types'
import type { ProjectDetails } from '@/types/Project'
import { ProjectStatus } from '@/types/Project'
import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { UpdateUserRequestBody } from '@/app/api/admin/users/[id]/route'
import type { PatchSemesterProjectRequestBody } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { UserRole } from '@/types/User'
import AdminSemesterService from './AdminSemesterService'
import { StatusCodes } from 'http-status-codes'

/**
 * Handles the click event to create semester
 *
 * @param formData The {@link FormData} from the SemesterForm
 * @returns Error with details or success message
 */
export const handleCreateSemester = async (
  formData: FormData,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const { status, error, details } = await AdminService.createSemester({
    name: formData.get('semesterName') as string,
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    deadline: new Date(formData.get('submissionDeadline') as string).toISOString(),
    published: false,
  })

  if (status === StatusCodes.CREATED) {
    return { message: 'Semester created successfully' }
  } else {
    return { error, details }
  }
}

/**
 * Handles the click event to update semester
 *
 * @param formData The {@link FormData} from the SemesterForm
 * @param id The id of the semester to be updated
 * @returns Error with details or success message
 */
export const handleUpdateSemester = async (
  formData: FormData,
  id: string,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const { status, error, details } = await AdminService.updateSemester(id, {
    name: formData.get('semesterName') as string,
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    deadline: new Date(formData.get('submissionDeadline') as string).toISOString(),
  })

  if (status === StatusCodes.OK) {
    return { message: 'Semester updated successfully' }
  } else {
    return { error, details }
  }
}

/**
 * Handles the click event to delete a semester
 *
 * @param id The id of the semester to delete
 * @returns Error or success message
 */
export const handleDeleteSemester = async (
  id: string,
): Promise<void | {
  message?: string
  error?: string
}> => {
  const { status, error } = await AdminService.deleteSemester(id)
  if (status === StatusCodes.NO_CONTENT) {
    return { message: 'Semester deleted successfully' }
  } else {
    return { error }
  }
}

/**
 * Handles fetching all {@link Semester}'s
 *
 * @returns All {@link Semester}'s
 */
export const handleGetAllSemesters = async (): Promise<void | {
  error?: string
  data?: Semester[]
  semesterStatuses?: Record<string, 'current' | 'upcoming' | ''>
}> => {
  const { status, error, data } = await AdminService.getAllSemesters()
  if (status === StatusCodes.OK) {
    const semesterStatuses: Record<string, 'current' | 'upcoming' | ''> =
      await AdminService.getSemesterStatuses(data || [])
    return { data, semesterStatuses }
  } else {
    return { error }
  }
}

/**
 * Gets all Semester Projects related to a semester
 *
 * @param id the id of the semester to get projects for
 * @returns The {@link ProjectDetails}'s related to the semester
 */
export const handleGetAllSemesterProjects = async (
  id: string,
): Promise<void | {
  error?: string
  data?: ProjectDetails[]
}> => {
  const { status, error, data } = await AdminService.getAllPaginatedProjectsBySemesterId(id, {
    status: ProjectStatus.Approved,
  })
  if (status === StatusCodes.OK) {
    const projectPromises =
      data?.map(async (semesterProject) => {
        const project = semesterProject.project as Project
        const semesters = await AdminService.getProjectSemesters(project.id)

        return {
          ...project,
          semesters: semesters.data || [],
          semesterProjectId: semesterProject.id,
        } as ProjectDetails
      }) || []

    const projects = await Promise.all(projectPromises)
    return { data: projects }
  } else {
    return { error }
  }
}

/**
 * Gets all clients and their projects
 *
 * @returns All {@link UserCombinedInfo}'s with their projects
 */
export const getAllClients = async (
  options: { limit?: number; page?: number; query?: string } = {},
): Promise<void | {
  error?: string
  data?: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  nextPage?: number
  totalPages?: number
  totalDocs?: number
}> => {
  const getClientsResponse = await AdminService.getAllUsers({ ...options, role: UserRole.Client })
  if (getClientsResponse.status == StatusCodes.OK) {
    const clientsWithProjects = await Promise.all(
      (getClientsResponse.data ?? []).map(async (client) => {
        const projectsResponse = await AdminService.getProjectsByUserId(client.id)
        return {
          client,
          projects: projectsResponse.data,
        }
      }),
    )
    return {
      data: clientsWithProjects,
      nextPage: getClientsResponse.nextPage,
      totalPages: getClientsResponse.totalPages,
      totalDocs: getClientsResponse.totalDocs,
    }
  } else {
    return { error: getClientsResponse.error }
  }
}

/**
 * Handles fetching all projects for the upcoming (next) semester
 *
 * @returns {@link SemesterContainerData} containing the id of the upcoming semester and all the related projects separated by status (rejected, pending, approved)
 */
export const getNextSemesterProjects = async (): Promise<void | {
  error?: string
  data?: SemesterContainerData
}> => {
  const { status, error, data } = await AdminService.getNextSemesterProjects()
  if (status == StatusCodes.OK) {
    return { data }
  } else {
    return { error }
  }
}

/**
 * Handles the saving of changes to project order and status
 *
 * @param presetContainers The list of {@link DNDType} containers from the Project Drag and Drop
 * @param semesterId The id of the upcoming semester
 * @returns Error or success message
 */
export async function updateProjectOrdersAndStatus({
  presetContainers,
  semesterId,
}: SemesterContainerData): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof PatchSemesterProjectRequestBody>
}> {
  const errors = []
  for (const container of presetContainers) {
    const status = container.title as ProjectStatus

    for (let i = 0; i < container.currentItems.length; i++) {
      const project = container.currentItems[i]
      const updatedOrderAndStatus = {
        number: container.currentItems.length - i,
        status: status,
      }

      const {
        status: statusCode,
        error,
        details,
      } = await AdminService.updateSemesterProject(
        semesterId,
        project.projectInfo.semesterProjectId ?? '',
        updatedOrderAndStatus,
      )
      if (statusCode != StatusCodes.OK) {
        errors.push({ error, details })
      }
    }
  }
  if (errors.length > 0) {
    return errors[0] // Return the first error encountered
  }
  return { message: 'Semester updated successfully' }
}

/**
 * Handles the publishing of approved projects
 *
 * @param semesterId The id of the upcoming semester
 * @returns Error or success message
 */
export async function handlePublishChanges(
  semesterId: string,
): Promise<void | { error?: string; message?: string }> {
  try {
    const semester = await AdminSemesterService.getSemester(semesterId)

    if (!semester?.data) {
      return { error: 'Semester not found.' }
    }

    const data = semester.data as Semester

    await AdminSemesterService.updateSemester(semesterId, {
      published: !data.published,
    })

    return { message: `Semester ${data.published ? 'unpublished' : 'published'} successfully.` }
  } catch (error: any) {
    console.error('Failed to publish/unpublish semester:', error)
    return { error: error?.message ?? 'An unknown error occurred.' }
  }
}

export async function handleUpdateClient(
  clientId: string,
  firstName: string,
  lastName: string,
  affiliation: string,
  introduction: string,
): Promise<{
  data?: UserCombinedInfo
  error?: string
  message?: string
  details?: string
}> {
  const updatedClient: UpdateUserRequestBody = {
    firstName,
    lastName,
    affiliation,
    introduction,
  }
  const response = await AdminService.updateUser(clientId, updatedClient)
  return { data: response.data }
}

export async function handleDeleteClient(clientId: string): Promise<{
  error?: string
  message?: string
}> {
  const response = await AdminService.deleteUser(clientId)
  if (response.status === StatusCodes.NO_CONTENT) {
    return { message: 'Client deleted successfully' }
  } else {
    return { error: response.error }
  }
}

export async function handleDeleteProject(projectId: string): Promise<{
  error?: string
  message?: string
}> {
  const response = await AdminService.deleteProject(projectId)
  if (response.status === StatusCodes.NO_CONTENT) {
    return { message: 'Project deleted successfully' }
  } else {
    return { error: response.error }
  }
}

export async function handleGetAllProjectsByClient(clientId: string): Promise<{
  error?: string
  data?: ProjectDetails[]
}> {
  const response = await AdminService.getProjectsByUserId(clientId)
  if (response.status === StatusCodes.OK) {
    const projects = response.data.map((project) => ({
      ...project,
      semesters: project.semesters || [],
    }))
    return { data: projects }
  } else {
    return { error: response.error }
  }
}
