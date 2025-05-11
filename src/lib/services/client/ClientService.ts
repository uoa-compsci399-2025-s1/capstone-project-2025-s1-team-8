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
   * @returns {userInfo: UserCombinedInfo, status: StatusCodes}
   * The user information and the status code of the request.
   * */
  async getClientInfo(): Promise<{
    userInfo: UserCombinedInfo
    status: StatusCodes
  }> {
    'use server'
    const url = await buildNextRequestURL('/api/users/me', {})
    const response = await GetClientInfo(await buildNextRequest(url, { method: 'GET' }))
    const userInfo = await response.json()
    return { userInfo: userInfo.data, status: response.status }
  },

  /**
   * Fetches projects for a client.
   * @returns {projects: Project[], status: StatusCodes}
   * The projects and the status code of the request.
   */
  async getClientProjects(): Promise<{
    projects: Project[]
    status: StatusCodes
  }> {
    'use server'
    const url = await buildNextRequestURL('api/users/me/projects', {})
    const response = await GetClientProjects(await buildNextRequest(url, { method: 'GET' }))
    const projects = await response.json()
    //console.log(projects)
    return { projects: projects.data, status: response.status }
  },

  /**
   * Updates the client information of the currently logged-in user.
   * @param updatedClient The updated client information.
   * @returns {updatedUser: UserCombinedInfo, status: StatusCodes, error?: string, details?: string}
   */
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
