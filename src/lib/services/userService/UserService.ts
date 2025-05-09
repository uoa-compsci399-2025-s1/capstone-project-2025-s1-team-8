import { LoginRequestBodySchema, POST as LoginPost } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'
import { typeToFlattenedError } from 'zod'
import { RegisterRequestBodySchema, POST as RegisterPost } from '@/app/api/auth/register/route'
import { UserRoleWithoutAdmin } from '@/types/User'
import { GET as GetUserDetails } from '@/app/api/users/me/route'
import { UserCombinedInfo } from '@/types/Collections'
import { GET as LogoutPost } from '@/app/api/auth/logout/route'

const UserService = {
  login: async function (options: { email: string; password: string }): Promise<{
    message: string
    redirect?: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof LoginRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/login', {})
    const response = await LoginPost(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, redirect, error, details } = await response.json()
    return { message, redirect, status: response.status, error, details }
  },

  getCurrentUserInfo: async function (): Promise<{ user: UserCombinedInfo; status: StatusCodes }> {
    'use server'
    const url = buildNextRequestURL('/api/users/me', {})
    const response = await GetUserDetails(await buildNextRequest(url, { method: 'GET' }))
    const { data } = await response.json()

    return { user: data, status: response.status }
  },

  register: async function (options: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRoleWithoutAdmin
  }): Promise<{
    message: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof RegisterRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/register', options)
    const response = await RegisterPost(
      await buildNextRequest(url, { method: 'POST', body: options }),
    )
    const { message, error, details } = await response.json()
    return { message, status: response.status, error, details }
  },

  logout: async function (): Promise<void> {
    const url = buildNextRequestURL('/api/auth/logout', {})
    await LogoutPost(await buildNextRequest(url, { method: 'GET' }))
  },
}

export default UserService
