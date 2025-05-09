'use server'

import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { typeToFlattenedError } from 'zod'
import AdminSemesterService from '@/lib/services/admin/AdminSemesterService'
import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import { PlaceholderProjectDetailsType } from '@/types/Project'

export const handleCreateSemester = async (
  formData: FormData,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const name = formData.get('semesterName') as string
  const deadline = new Date(formData.get('submissionDeadline') as string)
  const startDate = new Date(formData.get('startDate') as string)
  const endDate = new Date(formData.get('endDate') as string)

  if (!name) return { error: 'Semester name is required' }
  if (!deadline) return { error: 'Submission deadline is required' }
  if (!startDate) return { error: 'Start date is required' }
  if (!endDate) return { error: 'End date is required' }

  const { status, error, details } = await AdminSemesterService.createSemester({
    name,
    startDate,
    endDate,
    deadline,
  })

  if (status === 201) {
    return { message: 'Semester created successfully' }
  } else {
    return { error, details }
  }
}

export const getAllSemesters = async (): Promise<void | {
  error?: string
  data?: SemesterDTOPlaceholder[]
  details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
}> => {
  const { status, error, data } = await AdminSemesterService.getAllPaginatedSemesters()
  console.log(data)
  if (status === 200) {
    const semestersDto: SemesterDTOPlaceholder[] = await Promise.all(
      data?.map(async (semester) => {
        const id = semester.id
        const approvedProjects = await AdminSemesterService.getAllPaginatedProjectsBySemesterId(id)
        const approvedProjectsDto: PlaceholderProjectDetailsType[] = await Promise.all(
          approvedProjects.data?.map(async (semesterProject) => {
            if (typeof semesterProject.project === 'object') {
              // ts should always be a fucking object im sick of it
              return {
                projectId: semesterProject.project.id,
                projectTitle: semesterProject.project.name,
                projectClientDetails: semesterProject.project.client,
                otherClientDetails: semesterProject.project.additionalClients,
                projectDescription: semesterProject.project.description,
                desiredOutput: semesterProject.project.desiredOutput,
                desiredTeamSkills: semesterProject.project.desiredTeamSkills,
                availableResources: semesterProject.project.availableResources,
                specialRequirements: semesterProject.project.specialEquipmentRequirements,
              }
            }
          }) || [],
        )

        const isCurrentOrUpcoming = await AdminSemesterService.isCurrentOrUpcoming(id)

        return {
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
