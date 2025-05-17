'use server'

import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import { Project, Semester } from '@/payload-types'
import { ProjectDetails } from '@/types/Project'
import AdminService from '../services/admin'

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

export const isCurrentOrUpcoming = async (id: string): Promise<'current' | 'upcoming' | ''> => {
  return await AdminService.isCurrentOrUpcoming(id)
}
