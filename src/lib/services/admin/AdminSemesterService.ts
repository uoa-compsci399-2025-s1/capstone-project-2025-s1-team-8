import type { Semester, SemesterProject } from '@/payload-types'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetSemester } from '@/app/api/semesters/[id]/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'
import { POST as CreateSemester } from '@/app/api/admin/semesters/route'
import type { UpdateSemesterRequestBody } from '@/app/api/admin/semesters/[id]/route'
import { PATCH as UpdateSemester } from '@/app/api/admin/semesters/[id]/route'
import { DELETE as DeleteSemester } from '@/app/api/admin/semesters/[id]/route'
import { GET as GetSemesterProjects } from '@/app/api/projects/[id]/semesters/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import type { CreateSemesterData } from '@/types/Collections'
import type { UpdateSemesterData } from '@/types/Collections'
import type { ProjectStatus } from '@/types/Project'
import type { typeToFlattenedError } from 'zod'
import type { StatusCodes } from 'http-status-codes'

const AdminSemesterService = {
  /**
   * Fetches all semesters
   *
   * @returns an object containing the status, data, and error
   **/
  getAllSemesters: async function (): Promise<{
    status: StatusCodes
    data?: Semester[]
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL('/api/semesters', {})
    const response = await GetSemesters(await buildNextRequest(url, { method: 'GET' }))
    const { data, error } = { ...(await response.json()) }

    return { status: response.status, data, error }
  },

  /**
   * Fetches paginated projects based on a semester ID.
   *
   * @param semesterId the ID of the semester to fetch projects for
   * @param options optional parameters for pagination and filtering
   * @returns an object containing the status, data, nextPage, and error
   */
  getAllPaginatedProjectsBySemesterId: async function (
    semesterId: string,
    options: {
      page?: number
      limit?: number
      status?: ProjectStatus
    } = {},
  ): Promise<{
    status: StatusCodes
    data?: SemesterProject[]
    nextPage?: string
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, options)
    const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: semesterId }),
    })
    const { data, nextPage, error } = { ...(await response.json()) }

    return { status: response.status, data, nextPage, error }
  },

  /**
   * Gets a semester by ID
   *
   * @param semesterID The ID of the semester to retrieve
   * @returns an object containing the status, data, and error
   */
  getSemester: async function (semesterID: string): Promise<{
    status: StatusCodes
    data?: Semester
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/app/semesters/${semesterID}`, {})
    const res = await GetSemester(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: semesterID }),
    })

    const { error, data } = await res.json()
    return { status: res.status, data, error }
  },

  /**
   * Creates a semester
   *
   * @param semester the semester data to create
   * @returns an object containing the status, data, and error, details
   */
  createSemester: async function (semester: CreateSemesterData): Promise<{
    status: StatusCodes
    data?: Semester
    error?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }> {
    'use server'
    const url = '/api/admin/semesters'
    const response = await CreateSemester(
      await buildNextRequest(url, { method: 'POST', body: semester }),
    )
    const { data, error, details } = await response.json()

    return { status: response.status, data, error, details }
  },

  /**
   * Updates a semester
   *
   * @param semesterId the ID of the semester to update
   * @param semester the updated semester data
   * @returns an object containing the status, data, and error, details
   */
  updateSemester: async function (
    semesterId: string,
    semester: UpdateSemesterData,
  ): Promise<{
    status: StatusCodes
    data?: Semester
    error?: string
    details?: typeToFlattenedError<typeof UpdateSemesterRequestBody>
  }> {
    'use server'
    const url = `/api/admin/semesters/${semesterId}`
    const response = await UpdateSemester(
      await buildNextRequest(url, { method: 'PATCH', body: semester }),
      {
        params: Promise.resolve({ id: semesterId }),
      },
    )
    const { data, error, details } = await response.json()

    return { status: response.status, data, error, details }
  },

  /**
   * Deletes a semester
   *
   * @param semesterId the ID of the semester to delete
   * @returns an object containing the status, data, and error
   */
  deleteSemester: async function (semesterId: string): Promise<{
    status: StatusCodes
    data?: Semester
    error?: string
  }> {
    'use server'
    const url = `/api/admin/semesters/${semesterId}`
    const response = await DeleteSemester(await buildNextRequest(url, { method: 'DELETE' }), {
      params: Promise.resolve({ id: semesterId }),
    })
    const { error } = await response.json()

    return { status: response.status, error }
  },

  /**
   * Returns all semester Statuses
   * @param semesters an array of semesters to check
   * @returns a record mapping semester IDs to their statuses
   */

  getSemesterStatuses: async function (
    semesters: Semester[],
  ): Promise<Record<string, '' | 'current' | 'upcoming'>> {
    const semesterStatuses: Record<string, '' | 'current' | 'upcoming'> = {}
    const currentDate = new Date()
    let earliestUpcomingDateIndex = -1

    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i]
      const startDate = new Date(semester.startDate)
      const endDate = new Date(semester.endDate)
      if (startDate <= currentDate && endDate >= currentDate) {
        semesterStatuses[semester.id] = 'current'
      } else if (startDate > currentDate) {
        if (
          earliestUpcomingDateIndex === -1 ||
          startDate < new Date(semesters[earliestUpcomingDateIndex].startDate)
        ) {
          if (earliestUpcomingDateIndex !== -1) {
            semesterStatuses[semesters[earliestUpcomingDateIndex].id] = ''
          }
          earliestUpcomingDateIndex = i
          semesterStatuses[semester.id] = 'upcoming'
        }
      } else {
        semesterStatuses[semester.id] = ''
      }
    }

    return semesterStatuses
  },

  /**
   * Returns all semesters for a given project
   *
   * @param projectId the ID of the project to fetch semesters for
   * @returns an object containing the status, data, and error
   */
  getProjectSemesters: async function (projectId: string): Promise<{
    status: StatusCodes
    data?: Semester[]
    error?: string
  }> {
    'use server'
    const url = `/api/projects/${projectId}/semesters`
    const response = await GetSemesterProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: projectId }),
    })
    const { data, error } = { ...(await response.json()) }

    return { status: response.status, data, error }
  },
} as const

export default AdminSemesterService
