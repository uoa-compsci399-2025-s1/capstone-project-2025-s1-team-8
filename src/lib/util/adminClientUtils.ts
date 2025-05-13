'use server'

import { UserCombinedInfo } from '@/types/Collections'
import AdminService from '../services/admin'
import { ProjectDetails } from '@/types/Project'

export const getAllClients = async (): Promise<void | {
  data?: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
}> => {
  const getClientsResponse = await AdminService.getAllUsers()
  const clientsWithProjects = await Promise.all(
    (getClientsResponse.data ?? []).map(async (client) => {
      const projectsResponse = await AdminService.getProjectsByUserId(client.id)
      return {
        client,
        projects: projectsResponse.data,
      }
    }),
  )
  return { data: clientsWithProjects }
}
