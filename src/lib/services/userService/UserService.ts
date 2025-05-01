import { LoginRequestBodySchema, POST as LoginPost } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'
import { typeToFlattenedError } from 'zod'
import { RegisterRequestBodySchema, POST as RegisterPost } from '@/app/api/auth/register/route'
import { UserRoleWithoutAdmin } from '@/types/User'

const UserService = {
  login: async function (options: { email: string; password: string }): Promise<{
    message: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof LoginRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/login', {})
    const response = await LoginPost(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, error, details } = await response.json()
    return { message, status: response.status, error, details }
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
}

export default UserService
