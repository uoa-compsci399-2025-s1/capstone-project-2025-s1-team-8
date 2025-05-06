import { Project } from '@/payload-types'
import { GET as GetUsers } from '@/app/api/admin/users/route'
import { GET as GetUserById } from '@/app/api/admin/users/[id]/route'
import { PATCH as UpdateUser } from '@/app/api/admin/users/[id]/route'
import { DELETE as DeleteUser } from '@/app/api/admin/users/[id]/route'
import { GET as GetUserProjects } from '@/app/api/admin/users/[id]/projects/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { typeToFlattenedError } from 'zod'
import { UpdateUserRequestBody } from '@/app/api/admin/users/[id]/route'
import { ClientCombinedInfo } from '@/types/Payload'
import { StatusCodes } from 'http-status-codes'
import { UserRole } from '@/types/User'

const AdminClientService = {
  getAllUsers: async function (options: { limit?: number; cursor?: number; userRole?: UserRole } = {}): Promise<{
    status: StatusCodes
    data?: (typeof ClientCombinedInfo)[]
    nextPage?: string
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL('/api/admin/users', options)
    const response = await GetUsers(await buildNextRequest(url, { method: 'GET' }))
    const { data, nextPage, error } = { ...(await response.json()) }

    return { status: response.status, data, nextPage, error }
  },

  getUserById: async function (userId: string): Promise<{
    status: StatusCodes
    data: typeof ClientCombinedInfo
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/admin/users/${userId}`, {})
    const response = await GetUserById(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, error } = { ...(await response.json()) }

    return { status: response.status, data, error }
  },

  updateUser: async function (
    userId: string,
    user: UpdateUserRequestBody,
  ): Promise<{
    status: StatusCodes
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

    return { status: response.status, data, error, details }
  },

  deleteUser: async function (userId: string): Promise<{
    status: StatusCodes
    error?: string
  }> {
    'use server'
    const url = `/api/admin/users/${userId}`
    const response = await DeleteUser(await buildNextRequest(url, { method: 'DELETE' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { error } = await response.json()

    return { status: response.status, error }
  },

  getProjectsByUserId: async function (
    userId: string,
    options: { page?: number; limit?: number } = {},
  ): Promise<{
    status: StatusCodes
    data: Project[]
    nextPage?: string
    error?: string
  }> {
    'use server'
    const url = buildNextRequestURL(`/api/admin/users/${userId}/projects`, options)
    const response = await GetUserProjects(await buildNextRequest(url, { method: 'GET' }), {
      params: Promise.resolve({ id: userId }),
    })
    const { data, nextPage, error } = { ...(await response.json()) }

    return { status: response.status, data, nextPage, error }
  },
} as const
export default AdminClientService
