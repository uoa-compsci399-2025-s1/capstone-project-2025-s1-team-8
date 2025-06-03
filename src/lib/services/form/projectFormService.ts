import { buildNextRequest } from '@/utils/buildNextRequest'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjectById, PATCH as UpdateProject } from '@/app/api/projects/[id]/route'
import type { UpdateProjectRequestBody } from '@/app/api/projects/[id]/route'
import { POST as CreateProject } from '@/app/api/projects/route'
import { GET as GetProjectSemesters } from '@/app/api/projects/[id]/semesters/route'
import { POST as CreateSemesterProject } from '@/app/api/semesters/[id]/projects/route'
import type { StatusCodes } from 'http-status-codes'
import type { Project, Semester, SemesterProject } from '@/payload-types'
import type { SemesterType } from '@/types/Semester'
import type { CreateProjectRequestBody } from '@/app/api/projects/route'
import AdminProjectService from '../admin/AdminProjectService'
import type { ProjectDetails } from '@/types/Project'
import { ProjectStatus } from '@/types/Project'

const ProjectFormService = {
  /**
   * Gets all upcoming semesters
   * @param options Options for pagination and filtering
   * @returns A list of upcoming semesters with status information
   */
  getUpcomingSemesters: async function (options: {
    page?: number
    limit?: number
    timeframe?: SemesterType
  }): Promise<{
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
   * Fetches a project by its ID
   * @param id The ID of the project
   * @returns The project data with status information
   */
  getProjectById: async function (id: string): Promise<{
    status: StatusCodes
    data?: ProjectDetails
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/projects/${id}`, {})
    const response = await GetProjectById(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id }),
    })
    const { data: project, error } = { ...(await response.json()) }

    const semesterResult = await AdminProjectService.getProjectSemesters(project.id)

    const projectDetails: ProjectDetails = {
      ...project,
      semesters: semesterResult.data ?? [],
    }

    return { status: response.status, data: projectDetails, error }
  },

  /**
   * Submits the project form data
   * @param formData The form data to be submitted
   * @param semesterId The ID of the semester
   * @returns A response object with status and error information
   */
  submitProjectForm: async function (formData: CreateProjectRequestBody): Promise<{
    status: StatusCodes
    error?: string
    message?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/projects`, {})
    const response = await CreateProject(
      await buildNextRequest(url, {
        method: 'POST',
        body: formData,
      }),
    )
    const { error, message } = { ...(await response.json()) }

    return { status: response.status, error, message }
  },

  updateProject: async function (
    projectId: string,
    formData: UpdateProjectRequestBody,
  ): Promise<{
    status: StatusCodes
    error?: string
    message?: string
    updatedProject?: Project
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/projects/${projectId}`, {})
    const response = await UpdateProject(
      await buildNextRequest(url, {
        method: 'PATCH',
        body: formData,
      }),
      { params: Promise.resolve({ id: projectId }) },
    )
    const { error, message, data: updatedProject } = { ...(await response.json()) }

    return { status: response.status, error, message, updatedProject }
  },

  getProjectSemesters: async function (projectId: string): Promise<{
    status: StatusCodes
    data?: Semester[]
    error?: string
  }> {
    'use server'
    const url = `/api/projects/${projectId}/semesters`
    const response = await GetProjectSemesters(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: projectId }),
    })
    const { data, error } = { ...(await response.json()) }

    return { status: response.status, data, error }
  },

  createSemesterProject: async function (
    semesterId: string,
    project: Project,
  ): Promise<{
    status: StatusCodes
    data?: SemesterProject
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`api/semesters/${semesterId}/projects`, {})

    const response = await CreateSemesterProject(
      await buildNextRequest(url, {
        method: 'POST',
        body: { project, status: ProjectStatus.Pending, published: false },
      }),
      {
        params: Promise.resolve({ id: semesterId }),
      },
    )
    const { data, error } = { ...(await response.json()) }

    return { status: response.status, data, error }
  },
} as const

export default ProjectFormService
