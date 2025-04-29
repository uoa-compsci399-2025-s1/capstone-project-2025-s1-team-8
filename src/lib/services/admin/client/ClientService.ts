'use server'
import { ClientAdditionalInfo, Project } from '@/payload-types'
import { GET as GetUsers } from '@/app/api/admin/users/route'
import { GET as GetUserById } from '@/app/api/admin/users/[id]/route'
import { PATCH as UpdateUser } from '@/app/api/admin/users/[id]/route'
import { DELETE as DeleteUser } from '@/app/api/admin/users/[id]/route'
import { GET as GetUserProjects } from '@/app/api/admin/users/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { UpdateClientAdditionalInfoData } from '@/types/Collections'
import { typeToFlattenedError } from 'zod'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'

const ClientService = {
  getAllUsers: async function (
  options: {}
  ): Promise<{ data: ClientAdditionalInfo[]; error?: string}> {
    const url = buildNextRequestURL('/api/admin/users', options)
    const response = await GetUsers(await buildNextRequest(url, { method: 'GET' }))
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  },

  getUserById: async function (
    userId: string,
    options: {}
  ): Promise<{ data: ClientAdditionalInfo, error?: string }> {
    const url = buildNextRequestURL(`/api/admin/users/${userId}`, options)
    const response = await GetUserById(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  },

  updateUser: async function (
    userId: string,
    user: UpdateClientAdditionalInfoData,
  ): Promise<{
    data: ClientAdditionalInfo
    error?: string
    details?: typeToFlattenedError<typeof UpdateUserRequestBody>
  }> {
    const url = `/api/admin/users/${userId}`
    const response = await UpdateUser(
      await buildNextRequest(url, { method: 'PATCH', body: user }), 
      {
        params: Promise.resolve({ id: userId })
      }
    )
    const { data, error, details } = await response.json()
    return { data, error, details }
  },

  deleteUser: async function (
    userId: string
  ): Promise<{
    error?: string
  }> {
    const url = `/api/admin/users/${userId}`
    const response = await DeleteUser(
      await buildNextRequest(url, { method: 'DELETE' }),
      {
        params: Promise.resolve({ id: userId })
      }
    )
    const { error } = await response.json()
    return { error }
  },

  getProjectsByUserId: async function (
    userId: string,
    options: {}
  ): Promise<{ data: Project[], error?: string }> {
    const url = buildNextRequestURL(`/api/admin/users/${userId}/projects`, options)
    const response = await GetUserProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  }
} as const
export default ClientService
