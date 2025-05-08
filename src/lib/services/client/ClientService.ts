import { GET as GetClientInfo } from '@/app/api/users/me/route'
import { GET as GetClientProjects } from '@/app/api/users/me/projects/route'
import { PATCH as UpdateClientDetails } from '@/app/api/users/me/route'
import { UpdateUserData, UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { StatusCodes } from 'http-status-codes'

const ClientService = {
  /**
   * Fetches the client information of the currently logged-in user.
   * @returns The client information of the user.
   * */
  async getClientInfo(): Promise<{
    userInfo: UserCombinedInfo
    status: StatusCodes
  }> {
    'use server'
    const url = await buildNextRequestURL('/api/users/me', {})
    const response = await GetClientInfo(await buildNextRequest(url, { method: 'GET' }))
    const userInfo = await response.json()
    return { userInfo, status: response.status }
  },

  /**
   * Fetches projects for a client.
   * @returns The projects of the currently logged-in user.
   */
  async getClientProjects(): Promise<{
    projects: Project[]
    status: StatusCodes
  }> {
    'use server'
    const url = await buildNextRequestURL('api/users/me/projects', {})
    const response = await GetClientProjects(await buildNextRequest(url, { method: 'GET' }))
    const projects = await response.json()
    return { projects, status: response.status }
  },

  async updateClientDetails(updatedClient: UpdateUserData): Promise<{
    updatedUser: UserCombinedInfo
    status: StatusCodes
    error?: string
    details?: string
  }> {
    'use server'
    const url = await buildNextRequestURL('/api/users/me', {})
    const response = await UpdateClientDetails(
      await buildNextRequest(url, { method: 'PATCH', body: updatedClient }),
    )
    const { data, error, details } = await response.json()
    return {
      updatedUser: data,
      status: response.status,
      error,
      details,
    }
  },
} as const

export default ClientService
