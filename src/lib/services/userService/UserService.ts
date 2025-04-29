import { LoginRequestBodySchema, POST } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'
import { typeToFlattenedError } from 'zod'
import { RegisterRequestBodySchema } from '@/app/api/auth/register/route'

const UserService = {
  login: async function (options: { email: string; password: string }): Promise<{
    message: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof LoginRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/login', options)
    const response = await POST(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, status, error, details } = await response.json()
    return { message, status, error, details }
  },

  register: async function (options: { email: string; password: string }): Promise<{
    message: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof RegisterRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/register', options)
    const response = await POST(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, status, error, details } = await response.json()
    return { message, status, error, details }
  },
}

export default UserService
