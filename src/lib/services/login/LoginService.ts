import { POST } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { StatusCodes } from 'http-status-codes'

const LoginService = {
  login: async function (options: {
    email: string
    password: string
  }): Promise<{ message: string; status: StatusCodes; error?: string; details?: string }> {
    const url = buildNextRequestURL('/api/auth/login', options)
    const response = await POST(await buildNextRequest(url, { method: 'POST', body: options }))
    // should i return all message, status, error, details? usually only ONE is returned depending on
    // if the request is good or not
    const { message, status, error, details } = await response.json()
    return { message, status, error, details }
  },
}

export default LoginService
