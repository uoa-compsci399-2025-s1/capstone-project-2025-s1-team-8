import { LoginRequestBodySchema, POST as LoginPost } from '@/app/api/auth/login/route'
import { buildNextRequestURL } from '@/utils/buildNextRequestURL'
import { buildNextRequest } from '@/utils/buildNextRequest'
import { type StatusCodes } from 'http-status-codes'
import { type typeToFlattenedError } from 'zod'
import { RegisterRequestBodySchema, POST as RegisterPost } from '@/app/api/auth/register/route'
import { UserRoleWithoutAdmin } from '@/types/User'

const UserService = {
  /**
   * Logs in a user with the provided email and password.
   *
   * @param options The login options containing the user's email and password.
   * @returns A promise resolving to an object containing:
   *   - `message` string: A message indicating the result of the login attempt.
   *   - `redirect` string: A URL to redirect the user after a successful login.
   *   - `status` {@link StatusCodes}: The HTTP status code of the response.
   *   - `error` string: An error message if the login attempt failed.
   *   - `details` {@link typeToFlattenedError}: Validation error details, if any.
   */
  login: async function (options: { email: string; password: string }): Promise<{
    status: StatusCodes
    message?: string
    redirect?: string
    error?: string
    details?: typeToFlattenedError<typeof LoginRequestBodySchema>
  }> {
    const url = buildNextRequestURL('/api/auth/login', options)
    const response = await LoginPost(await buildNextRequest(url, { method: 'POST', body: options }))
    const { message, redirect, error, details } = await response.json()

    return { message, redirect, status: response.status, error, details }
  },

  /**
   * Registers a new user with the provided details.
   *
   * @param options The registration options containing the user's email, password, first name, last name, and role.
   * @returns A promise resolving to an object containing:
   *   - `status` {@link StatusCodes}: The HTTP status code of the response.
   *   - `message` string: A message indicating the result of the registration attempt.
   *   - `error` string: An error message if the registration attempt failed.
   *   - `details` {@link typeToFlattenedError}: Validation error details, if any.
   */
  register: async function (options: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRoleWithoutAdmin
  }): Promise<{
    status: StatusCodes
    message?: string
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
} as const

export default UserService
