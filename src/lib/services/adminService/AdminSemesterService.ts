import { Semester, SemesterProject } from '@/payload-types'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { POST as CreateSemester } from '@/app/api/admin/semesters/route'
import { PATCH as UpdateSemester } from '@/app/api/admin/semesters/[id]/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { CreateSemesterData } from '@/types/Collections'
import { UpdateSemesterData } from '@/types/Collections'
import { ProjectStatus } from '@/types/Project'
import { typeToFlattenedError, z } from 'zod'

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
  startDate: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
  endDate: z.string().datetime({ message: 'Invalid date format, should be in ISO 8601 format' }),
})

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  startDate: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
})

const AdminSemesterService = {
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
export default AdminSemesterService
