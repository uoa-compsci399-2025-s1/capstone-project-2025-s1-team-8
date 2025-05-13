import { Semester, SemesterProject } from '@/payload-types'
import { UpdateSemesterProjectData } from '@/types/Collections'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError } from 'zod'
import { GET as GetProjectSemesters } from '@/app/api/projects/[id]/semesters/route'

import {
  PatchSemesterProjectRequestBody,
  PATCH as UpdateSemesterProject,
} from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { StatusCodes } from 'http-status-codes'

const AdminProjectService = {
  UpdateSemesterProject: async function (
    semesterId: string,
    semesterProjectId: string,
    semesterProject: UpdateSemesterProjectData,
  ): Promise<{
    data: SemesterProject
    error?: string
    details?: typeToFlattenedError<typeof PatchSemesterProjectRequestBody>
  }> {
    'use server'
    const url = `/api/admin/semesters/${semesterId}/projects/${semesterProjectId}`
    const response = await UpdateSemesterProject(
      await buildNextRequest(url, { method: 'PATCH', body: semesterProject }),
      {
        params: Promise.resolve({ id: semesterId, projectId: semesterProjectId }),
      },
    )
    const { data, error, details } = await response.json()
    return { data, error, details }
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
}
export default AdminProjectService
