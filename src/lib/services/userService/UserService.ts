import { LoginRequestBodySchema, POST } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'
import { typeToFlattenedError } from 'zod'

const UserService = {
  login: async function (options: { email: string; password: string }): Promise<{
    message: string
    status: StatusCodes
    error?: string
    details?: typeToFlattenedError<typeof LoginRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/login', {})
    const response = await POST(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, error, details } = await response.json()
    return { message, status: response.status, error, details }
  },
}

export default UserService
