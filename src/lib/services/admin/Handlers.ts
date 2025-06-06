'use server'

import type { UserCombinedInfo } from '@/types/Collections'
import AdminService from 'src/lib/services/admin/index'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import type { typeToFlattenedError } from 'zod'
import type { Project, Semester } from '@/payload-types'
import type { ProjectDetails, ProjectStatus } from '@/types/Project'
import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import { UserRole } from '@/types/User'
import AdminSemesterService from './AdminSemesterService'

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

  if (status === 201) {
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
  const name = formData.get('semesterName') as string
  const deadline = formData.get('submissionDeadline') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  const { status, error, details } = await AdminService.updateSemester(id, {
    name,
    startDate,
    endDate,
    deadline,
  })

  if (status === 200) {
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
  if (status === 204) {
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
  if (status === 200) {
    const semesterStatuses: Record<string, 'current' | 'upcoming' | ''> = {}
    for (const semester of data || []) {
      const status = await isCurrentOrUpcoming(semester.id)
      semesterStatuses[semester.id] = status
    }
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
  const { status, error, data } = await AdminService.getAllPaginatedProjectsBySemesterId(id)
  if (status === 200) {
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
 * Determines whether a semester is current or upcoming
 *
 * @param id The id of the semester
 * @returns A string indicating the status of the semester
 */
export const isCurrentOrUpcoming = async (id: string): Promise<'current' | 'upcoming' | ''> => {
  return await AdminService.isCurrentOrUpcoming(id)
}

/**
 * Gets all clients and their projects
 *
 * @returns All {@link UserCombinedInfo}'s with their projects
 */
export const getAllClients = async (
  options: { limit?: number; page?: number; query?: string } = {},
): Promise<void | {
  data?: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  nextPage?: number
  totalPages?: number
}> => {
  const getClientsResponse = await AdminService.getAllUsers({ ...options, role: UserRole.Client })
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
  }
}

/**
 * Handles fetching all projects for the upcoming (next) semester
 *
 * @returns {@link SemesterContainerData} containing the id of the upcoming semester and all the related projects separated by status (rejected, pending, approved)
 */
export const getNextSemesterProjects = async (): Promise<void | {
  data?: SemesterContainerData
}> => {
  const response = await AdminService.getNextSemesterProjects()
  return { data: response.data }
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
}: SemesterContainerData): Promise<void> {
  for (const container of presetContainers) {
    const status = container.title as ProjectStatus

    for (let i = 0; i < container.currentItems.length; i++) {
      const project = container.currentItems[i]
      const updatedOrderAndStatus = {
        number: container.currentItems.length - i,
        status,
      }

      await AdminService.updateSemesterProject(
        semesterId,
        project.projectInfo.semesterProjectId ?? '',
        updatedOrderAndStatus,
      )
    }
  }
}

/**
 * Handles the publishing of approved projects
 *
 * @param semesterId The id of the upcoming semester
 * @returns Error or success message
 */
export async function handlePublishChanges(semesterId: string): Promise<void> {
  const semester = await AdminSemesterService.getSemester(semesterId)
  const data = semester.data
  await AdminSemesterService.updateSemester(semesterId, { published: !!data?.published })
}
