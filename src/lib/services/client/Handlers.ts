'use server'

import { redirect } from 'next/navigation'
import ClientService from '@/lib/services/client/ClientService'
import { StatusCodes } from 'http-status-codes'
import { UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'
import { Semester } from '@/payload-types'

export const handleClientPageLoad = async (): Promise<{
  userInfo: UserCombinedInfo
  projects: Project[]
  semesters: Semester[][]
}> => {
  const { userInfo, status } = await ClientService.getClientInfo()
  const clientProjectsRes = await ClientService.getClientProjects()

  if (status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  if (clientProjectsRes.status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  if (userInfo.role !== 'client') {
    redirect('/auth/login')
  }
  const semestersList: Semester[][] = []
  const projects = clientProjectsRes.projects

  for (let i = 0; i < projects.length; i++) {
    const { semesters, status, error, message } = await ClientService.getSemesterForProject(
      projects[i].id,
    )
    if (status === StatusCodes.OK) {
      semestersList.push(semesters)
    } else {
      semestersList.push([])
      console.error(`Error fetching semesters for project ${projects[i].id}: ${error || message}`)
    }
  }
  console.log('Semesters List:', semestersList)
  return { userInfo, projects: clientProjectsRes.projects, semesters: semestersList }
}
