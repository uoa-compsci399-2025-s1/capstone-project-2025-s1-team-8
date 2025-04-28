import { POST } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'

const LoginService = {
  login: async function (options: {
    email: string
    password: string
  }): Promise<{ message: string; status: StatusCodes; error?: string; details?: string }> {
    'use server'
    const url = buildNextRequestURL('/api/auth/login', options)
    const response = await POST(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, status, error, details } = await response.json()
    return { message, status, error, details }
  },
}

export default LoginService
