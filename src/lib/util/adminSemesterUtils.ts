'use server'

import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import AdminSemesterService from '@/lib/services/admin/AdminSemesterService'
import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import { ProjectDetailsType } from '@/types/Project'
import { Project, Semester, User } from '@/payload-types'

export const handleCreateSemester = async (
  formData: FormData,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const { status, error, details } = await AdminSemesterService.createSemester({
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

  const { status, error, details } = await AdminSemesterService.updateSemester(id, {
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
  const { status, error } = await AdminSemesterService.deleteSemester(id)
  if (status === 204) {
    return { message: 'Semester deleted successfully' }
  } else {
    return { error }
  }
}

export const getAllSemesters = async (): Promise<void | {
  error?: string
  data?: SemesterDTOPlaceholder[]
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const { status, error, data } = await AdminSemesterService.getAllPaginatedSemesters()
  if (status === 200) {
    const semestersDto: SemesterDTOPlaceholder[] = await Promise.all(
      data?.map(async (semester) => {
        const id = semester.id
        const approvedProjects = await AdminSemesterService.getAllPaginatedProjectsBySemesterId(id)
        const approvedProjectsDto: ProjectDetailsType[] = await Promise.all(
          approvedProjects.data?.map(async (semesterProject) => {
            const project = semesterProject.project as Project
            const semestersResponse = await AdminSemesterService.getProjectSemesters(project.id)
            return {
              semesterProjectId: semesterProject.id as string,
              projectId: project.id as string,
              projectTitle: project.name as string,
              projectClientDetails: project.client as User,
              otherClientDetails: project.additionalClients as User[],
              projectDescription: project.description as string,
              desiredOutput: project.desiredOutput as string,
              numberOfTeams: project.numberOfTeams as string,
              futureConsideration: project.futureConsideration,
              desiredTeamSkills: project.desiredTeamSkills as string,
              availableResources: project.availableResources as string,
              specialRequirements: project.specialEquipmentRequirements as string,
              submittedDate: new Date(project.createdAt),
              semesters: semestersResponse.data as Semester[],
            }
          }) || [],
        )
        const isCurrentOrUpcoming = await AdminSemesterService.isCurrentOrUpcoming(id)

        return {
          id: semester.id,
          semesterName: semester.name,
          startDate: new Date(semester.startDate),
          endDate: new Date(semester.endDate),
          submissionDeadline: new Date(semester.deadline),
          approvedProjects: approvedProjectsDto,
          currentOrUpcoming: isCurrentOrUpcoming,
        }
      }) || [],
    )

    return { data: semestersDto }
  } else {
    return { error }
  }
}
