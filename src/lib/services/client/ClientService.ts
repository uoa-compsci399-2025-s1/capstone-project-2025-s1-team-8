import { ClientAdditionalInfo } from '@/payload-types'
import { GET as GetUsers } from '@/app/api/admin/users/route'
import { GET as GetUserById } from '@/app/api/admin/users/[id]/route'
import { PATCH as UpdateUser } from '@/app/api/admin/users/[id]/route'
import { DELETE as DeleteUser } from '@/app/api/admin/users/[id]/route'
import { GET as GetUserProjects } from '@/app/api/admin/users/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { CreateClientAdditionalInfoData } from '@/types/Collections'
import { UpdateClientAdditionalInfoData } from '@/types/Collections'
import { UserRole } from '@/types/User'
import { typeToFlattenedError } from 'zod'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'

const SemesterService = {
  getAllPaginatedSemesters: async function (
    options: { page?: number; limit?: number } = {},
  ): Promise<{ data: Semester[]; nextPage?: string; error?: string }> {
    'use server'
    const url = buildNextRequestURL('/api/semesters', options)
    const response = await GetSemesters(await buildNextRequest(url, { method: 'GET' }))
    const { data, nextPage, error } = { ...(await response.json()) }
    return { data, nextPage, error }
  },

  getAllPaginatedProjectsBySemesterId: async function (
    semesterId: string,
    options: {
      page?: number
      limit?: number
      status?: ProjectStatus
      published?: 'true' | 'false'
    } = {},
  ): Promise<{ data: SemesterProject[]; nextPage?: string; error?: string }> {
    'use server'
    const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, options)
    const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: semesterId }),
    })
    const { data, nextPage, error } = { ...(await response.json()) }
    return { data, nextPage, error }
  },

  createSemester: async function (semester: CreateSemesterData): Promise<{
    data: Semester
    error?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }> {
    'use server'
    const url = '/api/admin/semesters'
    const response = await CreateSemester(
      await buildNextRequest(url, { method: 'POST', body: semester }),
    )
    const { data, error, details } = await response.json()
    return { data, error, details }
  },

  updateSemester: async function (
    semesterId: string,
    semester: UpdateSemesterData,
  ): Promise<{
    data: Semester
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
    return { data, error, details }
  },
} as const
export default SemesterService
