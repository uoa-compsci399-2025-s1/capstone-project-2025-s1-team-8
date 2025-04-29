'use server'
import { SemesterProject } from '@/payload-types'
import { UpdateSemesterProjectData } from '@/types/Collections'
import { PatchSemesterProjectRequestBody } from '@/types/request-models/ProjectRequests'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError } from 'zod'
import { PATCH as UpdateSemesterProject } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'

const ProjectService = {
  UpdateSemesterProject: async function (
    semesterId: string,
    semesterProjectId: string,
    semesterProject: UpdateSemesterProjectData,
  ): Promise<{
    data: SemesterProject
    error?: string
    details?: typeToFlattenedError<typeof PatchSemesterProjectRequestBody>
  }> {
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
}
export default ProjectService
