import { StatusCodes } from 'http-status-codes'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { POST as CreateProject } from '@/app/api/semesters/[id]/projects/route'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { Semester } from '@/payload-types'
import { SemesterType } from '@/types/Semester'

export interface ProjectFormData {
  clientName: string
  clientEmail: string
  otherClients?: { firstName: string; lastName: string ; email: string }[]
  projectTitle: string
  projectDescription: string
  desiredOutput: string
  specialEquipmentRequirements: string
  numberOfTeams: string
  desiredTeamSkills?: string
  availableResources?: string
  futureConsideration: string
  futureSemesters?: string[]
  meetingAttendance: boolean
  finalPresentationAttendance: boolean
  projectSupportAndMaintenance: boolean
}

const ProjectFormService = {
  /**
   * Gets all upcoming semesters
   * @param options Options for pagination and filtering
   * @returns A list of upcoming semesters with status information
   */
  getUpcomingSemesters: async function(
    options: { page?: number; limit?: number; timeframe?: SemesterType }
  ): Promise<{
    status: StatusCodes
    data?: Semester[]
    nextPage?: string
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL('/api/semesters', options)
    const response = await GetSemesters(await buildNextRequest(url, { method: 'GET' }))
    const { data, nextPage, error } = { ...(await response.json()) }

    return { status: response.status, data, nextPage, error }
  },
  
  /**
   * Submits the project form data
   * @param formData The form data to be submitted
   * @param semesterId The ID of the semester
   * @returns A response object with status and error information
   */
  submitProjectForm: async function(
    semesterId: string,
    formData: ProjectFormData,
  ): Promise<{
    status: StatusCodes
    error?: string
    message?: string
  }> {
    'use server'
    const response = await CreateProject(
      await buildNextRequest(`/api/semesters/${semesterId}/projects`, {
        method: 'POST',
        body: JSON.stringify(formData),
      }),
      { params: Promise.resolve({ id: semesterId }) }
    )
    const { error, message } = { ...(await response.json()) }

    return { status: response.status, error, message }
  }
} as const

export default ProjectFormService