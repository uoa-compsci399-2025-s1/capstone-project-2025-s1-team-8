'use server'
import { ProjectDetails } from '@/types/Project'
import { StudentService } from '@/lib/services/student/StudentServices'

export const handleStudentPageLoad = async (): Promise<{
  name: string
  projects: ProjectDetails[]
}> => {
  const res = await StudentService.getCurrentSemester()
  const projects = await StudentService.getProjectsForCurrentSemester()

  if (!res) {
    console.error('No current semester found')
    return { name: '', projects: [] }
  }
  const semesterName = res.name
  return { name: semesterName, projects }
}
