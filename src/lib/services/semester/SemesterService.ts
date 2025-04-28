import { Semester, SemesterProject } from '@/payload-types'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { POST as CreateSemester } from '@/app/api/admin/semesters/route'
import { PATCH as UpdateSemester } from '@/app/api/admin/semesters/[id]/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { CreateSemesterData } from '@/types/Collections'
import { UpdateSemesterData } from '@/types/Collections'

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
  ): Promise<{ data: SemesterProject[]; nextPage?: string; error?: string }> {
    'use server'
    const url = `/api/semesters/${semesterId}/projects`
    const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: semesterId }),
    })
    const { data, nextPage, error } = { ...(await response.json()) }
    return { data, nextPage, error }
  },

  createSemester: async function (
    semester: CreateSemesterData,
  ): Promise<{ data: Semester; error?: string }> {
    'use server'
    const url = '/api/admin/semesters'
    const response = await CreateSemester(
      await buildNextRequest(url, { method: 'POST', body: semester }),
    )
    const { data, error } = await response.json()
    return { data, error }
  },

  updateSemester: async function (
    semesterId: string,
    semester: UpdateSemesterData,
  ): Promise<{ data: Semester; error?: string }> {
    'use server'
    const url = `/api/admin/semesters/${semesterId}`
    const response = await UpdateSemester(
      await buildNextRequest(url, { method: 'PATCH', body: semester }),
      {
        params: Promise.resolve({ id: semesterId }),
      },
    )
    const { data, error } = await response.json()
    return { data, error }
  },
} as const
export default SemesterService
