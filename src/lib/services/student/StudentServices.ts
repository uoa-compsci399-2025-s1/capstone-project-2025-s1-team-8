import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { GET as GetSemesters } from '@/app/api/semesters/route'
import { GET as GetProjects } from '@/app/api/semesters/[id]/projects/route'
import { SemesterType } from '@/types/Semester'
import type { Project, Semester, SemesterProject } from '@/payload-types'
import { ProjectStatus, type ProjectDetails } from '@/types/Project'

export const StudentService = {
  getCurrentSemester: async function (): Promise<{ id: string; name: string } | null> {
    const semesterUrl = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Current })
    const semesterResponse = await GetSemesters(
      await buildNextRequest(semesterUrl, { method: 'GET' }),
    )
    const { data: semester, error } = await semesterResponse.json()

    if (error) {
      console.error('Failed to fetch current semester:', error)
      return null
    }

    if (semester.length === 0) {
      const semesterUrl1 = buildNextRequestURL('/api/semesters', { timeframe: SemesterType.Next })
      const semesterResponse1 = await GetSemesters(
        await buildNextRequest(semesterUrl1, { method: 'GET' }),
      )
      const { data: semester1, error: error1 } = await semesterResponse1.json()
      if (error1 || semester1.length === 0) {
        console.error('Failed to fetch upcoming semester:', error1)
        return null
      }
      return { id: semester1[0].id, name: semester1[0].name }
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
    const url = buildNextRequestURL(`/api/semesters/${semesterId}/projects`, {
      student: 'true',
      status: ProjectStatus.Approved,
    })
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
