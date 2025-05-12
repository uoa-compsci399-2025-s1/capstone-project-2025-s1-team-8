'use server'

import { redirect } from 'next/navigation'
import ClientService from '@/lib/services/client/ClientService'
import { StatusCodes } from 'http-status-codes'
import { UserCombinedInfo } from '@/types/Collections'
import { Project, Semester } from '@/payload-types'

export const handleClientPageLoad = async (): Promise<{
  userInfo: UserCombinedInfo
  projects: Project[]
  semesters: Semester[][]
}> => {
  const { userInfo, status } = await ClientService.getClientInfo()
  const clientProjectsRes = await ClientService.getClientProjects()

  if (
    status !== StatusCodes.OK ||
    clientProjectsRes.status !== StatusCodes.OK ||
    (userInfo.role !== 'client' && userInfo.role !== 'admin')
  ) {
    redirect('/not-found')
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

  return { userInfo, projects: clientProjectsRes.projects, semesters: semestersList }
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

export const handleClientUpdateSave = async (
  name: string,
  previousName: string,
  affiliation: string,
  previousAffiliation: string,
  introduction: string,
  previousIntroduction: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setAffiliation: React.Dispatch<React.SetStateAction<string>>,
  setIntroduction: React.Dispatch<React.SetStateAction<string>>,
  setPreviousName: React.Dispatch<React.SetStateAction<string>>,
  setPreviousAffiliation: React.Dispatch<React.SetStateAction<string>>,
  setPreviousIntroduction: React.Dispatch<React.SetStateAction<string>>,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const names = name.split(' ')
  const firstName = names[0]
  const lastName = names[1]
  if (!firstName || !lastName) {
    setName(previousName)
    setIsEditing(false)
    alert('Please enter a valid first and last name.') //placeholder
    return
  }

  if (names.length > 2) {
    setName(previousName)
    setIsEditing(false)
    alert('Please enter only first and last name.') //placeholder
    return
  }

  /*const res = await handleClientProfileUpdate(firstName, lastName, affiliation, introduction)
  if (res.error) {
    setName(previousName)
    setAffiliation(previousAffiliation)
    setIntroduction(previousIntroduction)
    alert('Error updating profile: ' + res.error || res.details) //placeholder
    return
  }*/

  setPreviousName(name)
  setPreviousAffiliation(affiliation)
  setPreviousIntroduction(introduction)
  setIsEditing(false)
}
