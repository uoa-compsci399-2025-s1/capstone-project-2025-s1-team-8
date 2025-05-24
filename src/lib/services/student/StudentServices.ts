import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { SemesterType } from '@/types/Semester'
import type { Project, Semester, SemesterProject } from '@/payload-types'
import type { ProjectDetails } from '@/types/Project'

export const StudentService = {
  getCurrentSemester: async function (): Promise<{ id: string; name: string } | null> {
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Current })
    const semesterResponse = await GetSemesters(
      await buildNextRequest(semesterUrl, { method: 'GET' }),
    )
    const { data: semester, error } = await semesterResponse.json()

    if (error || !semester?.length) {
      console.error('Failed to fetch current semester:', error)
      return null
    }

    return { id: semester[0].id, name: semester[0].name }
  },

  getProjectsForCurrentSemester: async function (): Promise<ProjectDetails[]> {
    const res = await StudentService.getCurrentSemester()
    if (!res) {
      console.error('No current semester found')
      return []
    }
    const semesterId = res.id
    const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, { published: 'true' })
    const response = await GetProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: semesterId }),
    })
    const { data, error } = await response.json()

    if (error) {
      console.error('Failed to fetch projects for semester:', error)
      return []
    }
    const projects: ProjectDetails[] = []

    for (const semesterProject of data) {
      const projectInfo = (semesterProject as SemesterProject).project as Project
      projects.push({
        ...projectInfo,
        semesters: [(semesterProject as SemesterProject).semester as Semester],
        number: semesterProject.number,
      })
    }

    projects.sort((a, b) =>
      a.number && b.number ? a.number - b.number : a.name.localeCompare(b.name),
    )

    return projects
  },
}
