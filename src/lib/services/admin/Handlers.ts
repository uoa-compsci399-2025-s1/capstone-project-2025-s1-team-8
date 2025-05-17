'use server'

import { UserCombinedInfo } from '@/types/Collections'
import AdminService from 'src/lib/services/admin/index'
import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import { Project, Semester } from '@/payload-types'
import { ProjectDetails } from '@/types/Project'

/**
 * handles the click event to create semester
 * @param formData data from SemesterForm
 * @returns {error, message, details} where error is the error message,
 * message is the success message, and details is the details of request body error
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
 * handles the click event to update semester
 * @param formData data from SemesterForm
 * @param id the id of the semester to be updated
 * @returns {error, message, details} where error is the error message,
 * message is the success message, and details is the details of request body error
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
 * handles the click event to delete a semester
 * @param id the id of the semester to delete
 * @returns {error, message} where error is the error message,
 * and message is the success message
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
 * handles the click event to create semester
 * @param formData data from SemesterForm
 * @returns {error, message, details} where error is the error message,
 * message is the success message, and details is the details of request body error
 */
export const getAllSemesters = async (): Promise<void | {
  error?: string
  data?: Semester[]
}> => {
  const { status, error, data } = await AdminService.getAllPaginatedSemesters()
  if (status === 200) {
    return { data }
  } else {
    return { error }
  }
}

/**
 * gets all Semester Projects related to a semester
 * @param id the id of the semester to get projects for
 * @returns {error, data} where error is the error message,
 * data is the array of projects related to the semester
 */
export const getAllSemesterProjects = async (
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
 * determines whether a semester is current or upcoming
 * @param id the id of the semester
 * @returns {'current' | 'upcoming' | ''}
 */
export const isCurrentOrUpcoming = async (id: string): Promise<'current' | 'upcoming' | ''> => {
  return await AdminService.isCurrentOrUpcoming(id)
}

/**
 * gets all Clients
 * @returns { client, projects } array containing clients and their associated projects
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
