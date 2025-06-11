import type { Project, Semester, SemesterProject } from '@/payload-types'
import type { UpdateSemesterProjectData } from '@/types/Collections'
import type { PatchSemesterProjectRequestBody } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { buildNextRequest } from '@/utils/buildNextRequest'
import type { typeToFlattenedError } from 'zod'
import { PATCH as UpdateSemesterProject } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { GET as GetProjectSemesters } from '@/app/api/projects/[id]/semesters/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { ProjectStatus } from '@/types/Project'
import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { ProjectCardType } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { StatusCodes } from 'http-status-codes'
import { DELETE as DeleteProject } from '@/app/api/projects/[id]/route'

const AdminProjectService = {
  updateSemesterProject: async function (
    semesterId: string,
    semesterProjectId: string,
    semesterProject: UpdateSemesterProjectData,
  ): Promise<{
    status: StatusCodes
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
    return { status: response.status, data, error, details }
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

  getNextSemesterProjects: async function (): Promise<{
    status: StatusCodes
    data?: SemesterContainerData
    error?: string
  }> {
    'use server'

    try {
      const semesterId = await AdminProjectService.getNextSemesterId()
      if (!semesterId) {
        return {
          status: StatusCodes.NOT_FOUND,
          error: 'No next semester found',
        }
      }

      const [pending, approved, rejected] = await Promise.all([
        AdminProjectService.fetchProjectsByStatus(semesterId, ProjectStatus.Pending),
        AdminProjectService.fetchProjectsByStatus(semesterId, ProjectStatus.Approved),
        AdminProjectService.fetchProjectsByStatus(semesterId, ProjectStatus.Rejected),
      ])

      const combinedErrors = [pending, approved, rejected]
        .map((res) => res.error)
        .filter(Boolean)
        .join('; ')

      const data: SemesterContainerData = {
        semesterId,
        presetContainers: [
          {
            id: 'rejected-container' as UniqueIdentifier,
            title: ProjectStatus.Rejected,
            containerColor: 'light',
            currentItems: rejected.data,
            originalItems: rejected.data,
          },
          {
            id: 'pending-container' as UniqueIdentifier,
            title: ProjectStatus.Pending,
            containerColor: 'medium',
            currentItems: pending.data,
            originalItems: pending.data,
          },
          {
            id: 'approved-container' as UniqueIdentifier,
            title: ProjectStatus.Approved,
            containerColor: 'dark',
            currentItems: approved.data,
            originalItems: approved.data,
          },
        ],
      }

      return {
        status: StatusCodes.OK,
        data,
        ...(combinedErrors && { error: combinedErrors }),
      }
    } catch (e) {
      console.error('Unexpected error in getNextSemesterProjects:', e)
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Failed to fetch next semester projects',
      }
    }
  },

  getNextSemesterId: async function (): Promise<string | null> {
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: 'next' })
    const semesterResponse = await GetSemesters(
      await buildNextRequest(semesterUrl, { method: 'GET' }),
    )
    const { data: semester, error } = await semesterResponse.json()

    if (error || !semester?.length) {
      console.error('Failed to fetch next semester:', error)
      return null
    }

    return semester[0].id
  },

  fetchProjectsByStatus: async function (
    semesterId: string,
    status: ProjectStatus,
  ): Promise<{ data: ProjectCardType[]; error?: string }> {
    try {
      const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, { status })
      const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
        params: Promise.resolve({ id: semesterId }),
      })
      const { data, error } = await response.json()

      if (error || !Array.isArray(data)) {
        const message = `API error or invalid data for ${status} projects. ${error}`
        return { data: [], error: message }
      }

      const sortedProjects = data.sort((a: SemesterProject, b: SemesterProject) => {
        const aNum = a.number
        const bNum = b.number
        if (aNum == null && bNum == null) return 0
        if (aNum == null) return 1
        if (bNum == null) return -1
        return bNum - aNum
      })

      const transformed = await Promise.all(
        sortedProjects.map(async (proj) => {
          try {
            return await AdminProjectService.transformSemesterProject(proj)
          } catch (e) {
            console.error(`Transform error for project ${proj.id}:`, e)
            return null
          }
        }),
      )
      return { data: transformed.filter(Boolean) as ProjectCardType[] }
    } catch (e) {
      return { data: [], error: `Unexpected error fetching ${status} projects. ${e}` }
    }
  },

  transformSemesterProject: async function (
    semesterProject: SemesterProject,
  ): Promise<ProjectCardType | null> {
    try {
      const project = semesterProject.project as Project
      const { data: semesters, error } = await AdminProjectService.getProjectSemesters(project.id)

      if (error) {
        console.error(`Failed to get semesters for project ${project.id}:`, error)
      }

      return {
        id: `item-${project.id}` as UniqueIdentifier,
        projectInfo: {
          ...project,
          semesters: semesters ?? [],
          semesterProjectId: semesterProject.id,
        },
      }
    } catch (e) {
      console.error(`transformSemesterProject failed for ${semesterProject.id}:`, e)
      return null
    }
  },

  deleteProject: async function (projectId: string): Promise<{
    status: StatusCodes
    error?: string
  }> {
    'use server'
    const url = `/api/projects/${projectId}`
    const response = await DeleteProject(await buildNextRequest(url, { method: 'DELETE' }), {
      params: Promise.resolve({ id: projectId }),
    })
    let error
    if (response.status !== StatusCodes.NO_CONTENT) {
      const body = await response.json()
      error = body.error
    }

    return { status: response.status, error }
  },
}
export default AdminProjectService
