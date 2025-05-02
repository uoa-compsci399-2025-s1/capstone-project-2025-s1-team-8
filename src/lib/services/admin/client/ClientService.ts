import { ClientAdditionalInfo, Project } from '@/payload-types'
import { GET as GetUsers } from '@/app/api/admin/users/route'
import { GET as GetUserById } from '@/app/api/admin/users/[id]/route'
import { PATCH as UpdateUser } from '@/app/api/admin/users/[id]/route'
import { DELETE as DeleteUser } from '@/app/api/admin/users/[id]/route'
import { GET as GetUserProjects } from '@/app/api/admin/users/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError, z } from 'zod'
import { UpdateUserRequestBody } from '@/app/api/admin/users/[id]/route'
import { ClientCombinedInfo } from '@/types/Payload'

const ClientService = {
  getAllUsers: async function (): Promise<{ data: typeof ClientCombinedInfo[]; error?: string }> {
    'use server'
    const url = buildNextRequestURL('/api/admin/users', {})
    const response = await GetUsers(await buildNextRequest(url, { method: 'GET' }))
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  },

  getUserById: async function (
    userId: string
  ): Promise<{ data: typeof ClientCombinedInfo; error?: string }> {
    'use server'
    const url = buildNextRequestURL(`/api/admin/users/${userId}`, {})
    const response = await GetUserById(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  },

  updateUser: async function (
    userId: string,
    user: UpdateUserRequestBody,
  ): Promise<{
    data: typeof ClientCombinedInfo
    error?: string
    details?: typeToFlattenedError<UpdateUserRequestBody>
  }> {
    'use server'
    const url = `/api/admin/users/${userId}`
    const response = await UpdateUser(
      await buildNextRequest(url, { method: 'PATCH', body: user }),
      {
        params: Promise.resolve({ id: userId }),
      },
    )
    const { data, error, details } = await response.json()
    return { data, error, details }
  },

  deleteUser: async function (userId: string): Promise<{
    error?: string
  }> {
    'use server'
    const url = `/api/admin/users/${userId}`
    const response = await DeleteUser(await buildNextRequest(url, { method: 'DELETE' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { error } = await response.json()
    return { error }
  },

  getProjectsByUserId: async function (
    userId: string,
    options: {},
  ): Promise<{ data: Project[]; error?: string }> {
    'use server'
    const url = buildNextRequestURL(`/api/admin/users/${userId}/projects`, options)
    const response = await GetUserProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, error } = { ...(await response.json()) }
    return { data, error }
  },
} as const
export default ClientService
