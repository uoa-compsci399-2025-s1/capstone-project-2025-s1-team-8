import type { Semester, SemesterProject } from '@/payload-types'
import { GET as GetSemesters } from '@/app/api/semesters/route'
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
import { SemesterType } from '@/types/Semester'

const AdminSemesterService = {
  /**
   * returns all semesters with pagination
   *
   * @param options - pagination options including page and limit
   * @returns - an object containing the status, data, nextPage, and error
   **/
  getAllPaginatedSemesters: async function (
    options: { page?: number; limit?: number } = {},
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
   * returns all Semester Projects for a given semester with pagination
   *
   * @param semesterId
   * @param options
   * @returns - an object containing the status, data, nextPage, and error
   */
  getAllPaginatedProjectsBySemesterId: async function (
    semesterId: string,
    options: {
      page?: number
      limit?: number
      status?: ProjectStatus
      published?: 'true' | 'false'
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
   * creates a semester
   *
   * @param semester
   * @returns - an object containing the status, data, and error, details
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
   * updates a semester
   *
   * @param semesterId
   * @param semester updates semester data
   * @returns - an object containing the status, data, and error, details
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
   * deletes a semester
   *
   * @param semesterId
   * @returns - an object containing the status, data, and error
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
   * checks if the semester is current or upcoming
   *
   * @param semesterId The ID of the semester to check
   * @returns a string indicating if the semester is current, upcoming, or empty
   */
  isCurrentOrUpcoming: async function (semesterId: string): Promise<'current' | 'upcoming' | ''> {
    'use server'
    const urlCurrent = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Current })
    const responseCurrent = await GetSemesters(
      await buildNextRequest(urlCurrent, { method: 'GET' }),
    )
    const dataCurrent = await responseCurrent.json()

    const urlNext = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Next })
    const responseNext = await GetSemesters(await buildNextRequest(urlNext, { method: 'GET' }))
    const dataNext = await responseNext.json()

    if (dataCurrent.data[0]?.id === semesterId) {
      return 'current'
    }
    if (dataNext.data[0]?.id === semesterId) {
      return 'upcoming'
    }
    return ''
  },

  /**
   * returns all semesters for a given project
   *
   * @param projectId
   * @returns - an object containing the status, data, and error
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
