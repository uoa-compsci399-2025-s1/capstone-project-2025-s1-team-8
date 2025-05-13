import { GET as GetClientInfo } from '@/app/api/users/me/route'
import { GET as GetClientProjects } from '@/app/api/users/me/projects/route'
import { PATCH as UpdateClientDetails } from '@/app/api/users/me/route'
import {
  UpdateClientAdditionalInfoData,
  UpdateUserData,
  UserCombinedInfo,
} from '@/types/Collections'
import { Project, Semester } from '@/payload-types'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { StatusCodes } from 'http-status-codes'
import { GET as GetSemesters } from '@/app/api/projects/[id]/semesters/route'

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
    return { projects: projects.data, status: response.status }
  },

  /**
   * Updates the client information of the currently logged-in user.
   * @param updatedClient The updated client information.
   * @returns {updatedUser: UserCombinedInfo, status: StatusCodes, error?: string, details?: string}
   */
  async updateClientDetails(
    updatedClient: Omit<UpdateUserData & Partial<UpdateClientAdditionalInfoData>, 'email'>,
  ): Promise<{
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

  async getSemesterForProject(projectId: string): Promise<{
    semesters: Semester[]
    status: StatusCodes
    error?: string
    message?: string
  }> {
    'use server'
    const url = await buildNextRequestURL(`/api/projects/${projectId}/semesters`, {})
    const response = await GetSemesters(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: projectId }),
    })
    const { data, error, message } = await response.json()
    return { semesters: data, status: response.status, error, message }
  },
} as const

export default ClientService
