'use server'

import type { UserCombinedInfo } from '@/types/Collections'
import AdminService from 'src/lib/services/admin/index'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import type { typeToFlattenedError } from 'zod'
import type { Project, Semester } from '@/payload-types'
import { type ProjectDetails, ProjectStatus } from '@/types/Project'
import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { UpdateUserRequestBody } from '@/app/api/admin/users/[id]/route'
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
  const { status, error, details } = await AdminService.updateSemester(id, {
    name: formData.get('semesterName') as string,
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    deadline: new Date(formData.get('submissionDeadline') as string).toISOString(),
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
}> => {
  const { status, error, data } = await AdminService.getAllSemesters()
  if (status === 200) {
    return { data }
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
export const getAllClients = async (): Promise<void | {
  data?: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
}> => {
  const getClientsResponse = await AdminService.getAllUsers()
  const clientsWithProjects = await Promise.all(
    (getClientsResponse.data ?? []).map(async (client) => {
      const projectsResponse = await AdminService.getProjectsByUserId(client.id)
      return {
        client,
        projects: projectsResponse.data,
      }
    }),
  )
  return { data: clientsWithProjects }
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
    const shouldSetUnpublished =
      status === ProjectStatus.Rejected || status === ProjectStatus.Pending

    for (let i = 0; i < container.currentItems.length; i++) {
      const project = container.currentItems[i]
      const updatedOrderAndStatus = {
        number: container.currentItems.length - i,
        status,
        ...(shouldSetUnpublished && { published: false }),
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
 * @param presetContainers The list of {@link DNDType} containers from the Project Drag and Drop
 * @param semesterId The id of the upcoming semester
 * @returns Error or success message
 */
export async function handlePublishChanges({
  presetContainers,
  semesterId,
}: SemesterContainerData): Promise<void> {
  const container = presetContainers[2]
  for (let i = 0; i < container.currentItems.length; i++) {
    const project = container.currentItems[i]
    await AdminService.updateSemesterProject(
      semesterId,
      project.projectInfo.semesterProjectId ?? '',
      { published: true },
    )
  }
  await updateProjectOrdersAndStatus({ presetContainers, semesterId })
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
