'use server'

import { redirect } from 'next/navigation'
import ClientService from '@/lib/services/client/ClientService'
import { StatusCodes } from 'http-status-codes'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

export const handleClientPageLoad = async (): Promise<{
  projects: ProjectDetails[]
}> => {
  const clientProjectsRes = await ClientService.getClientProjects()

  if (clientProjectsRes.status !== StatusCodes.OK) {
    redirect('/not-found')
  }

  const projects = clientProjectsRes.projects ?? []
  const projectsWithSemesters: ProjectDetails[] = []

  for (let i = 0; i < projects.length; i++) {
    const { semesters, status, error, message } = await ClientService.getSemesterForProject(
      projects[i].id,
    )
    if (status === StatusCodes.OK) {
      projectsWithSemesters.push({ ...projects[i], semesters })
    } else {
      projectsWithSemesters.push({ ...projects[i], semesters: [] })
      console.error(`Error fetching semesters for project ${projects[i].id}: ${error || message}`)
    }
  }

  return { projects: projectsWithSemesters }
}

export const handleClientProfileUpdate = async (
  firstName: string,
  lastName: string,
  affiliation: string,
  introduction: string,
): Promise<{
  updatedUser: UserCombinedInfo
  status: StatusCodes
  error?: string
  details?: string
}> => {
  const { updatedUser, status, error, details } = await ClientService.updateClientDetails({
    firstName,
    lastName,
    affiliation,
    introduction,
  })
  if (status !== StatusCodes.OK) {
    console.error(`Error updating client profile: ${error || details}`)
  }
  return { updatedUser, status, error, details }
}
