'use server'

import { UserCombinedInfo } from '@/types/Collections'
import AdminService from 'src/lib/services/admin/index'
import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import { Project } from '@/payload-types'
import { ProjectDetails } from '@/types/Project'

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
