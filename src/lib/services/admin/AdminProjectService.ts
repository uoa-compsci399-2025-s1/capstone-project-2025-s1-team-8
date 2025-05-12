import { Project, SemesterProject } from '@/payload-types'
import { UpdateSemesterProjectData } from '@/types/Collections'
import { PatchSemesterProjectRequestBody } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError } from 'zod'
import { PATCH as UpdateSemesterProject } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { ProjectStatus } from '@/types/Project'
import { DndComponentProps } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import { ProjectCardType } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { UniqueIdentifier } from '@dnd-kit/core'

const AdminProjectService = {
  updateSemesterProject: async function (
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

  getNextSemesterProjects: async function (): Promise<{
    data: DndComponentProps
    error?: string
  }> {
    'use server'
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: 'next' })
    const semesterResponse = await GetSemesters(
      await buildNextRequest(semesterUrl, { method: 'GET' }),
    )
    const { data: semester, error: semesterError } = await semesterResponse.json()

    if (semesterError || !semester) {
      return { data: null as any, error: semesterError || 'No semester found' }
    }

    const semesterId = semester[0].id

    const fetchProjects = async (status: ProjectStatus) => {
      const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, { status })
      const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
        params: Promise.resolve({ id: semesterId }),
      })
      const { data, error } = await response.json()

      if (error || !data) {
        console.error('Failed to fetch projects')
        return []
      }

      const sortedData = data.sort((a: SemesterProject, b: SemesterProject) => {
        const aNum = a.number
        const bNum = b.number
      
        if (aNum == null && bNum == null) return 0
        if (aNum == null) return 1  // a goes after b
        if (bNum == null) return -1 // b goes after a
      
        return bNum - aNum // descending order
      })
      
      const projects: ProjectCardType[] = sortedData.map(
        (semesterProject: SemesterProject) => {
          const project = semesterProject.project as Project
          return {
            id: `item-${project.id}` as UniqueIdentifier, // needs to contain 'item' for drag and drop logic
            projectInfo: {
              semesterProjectId: semesterProject.id,
              projectId: project.id,
              projectTitle: project.name,
              projectClientDetails: project.client,
              otherClientDetails: project.additionalClients,
              projectDescription: project.description,
              desiredOutput: project.desiredOutput,
              desiredTeamSkills: project.desiredTeamSkills,
              availableResources: project.attachments,
              specialRequirements: project.specialEquipmentRequirements,
              numberOfTeams: project.numberOfTeams,
              futureConsideration: project.futureConsideration,
              semesters: [], //TODO - get semesters
              submittedDate: new Date(project.createdAt),
            },
          }
        },
      )

      return projects
    }

    const [pendingProjects, approvedProjects, rejectedProjects] = await Promise.all([
      fetchProjects(ProjectStatus.Pending),
      fetchProjects(ProjectStatus.Approved),
      fetchProjects(ProjectStatus.Rejected),
    ])
    return {
      data: {
        semesterId: semesterId,
        presetContainers: [
          {
            id: 'rejected-container' as UniqueIdentifier, //needs to contain 'container' for drag and drop logic
            title: ProjectStatus.Rejected,
            containerColor: 'light' as const,
            currentItems: rejectedProjects,
            originalItems: rejectedProjects,
          },
          {
            id: 'pending-container' as UniqueIdentifier,
            title: ProjectStatus.Pending,
            containerColor: 'medium' as const,
            currentItems: pendingProjects,
            originalItems: pendingProjects,
          },
          {
            id: 'approved-container' as UniqueIdentifier,
            title: ProjectStatus.Approved,
            containerColor: 'dark' as const,
            currentItems: approvedProjects,
            originalItems: approvedProjects,
          },
        ],
      },
    }
  },
}
export default AdminProjectService
