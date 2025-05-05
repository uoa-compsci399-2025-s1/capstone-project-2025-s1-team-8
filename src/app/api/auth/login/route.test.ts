import { StatusCodes } from 'http-status-codes'
import * as nextHeaders from 'next/headers'
import { redirect } from 'next/navigation'

import UserService from '@/data-layer/services/UserService'
import { CLIENT_JWT_MOCK, clientMock } from '@/test-config/mocks/Auth.mock'
import AuthDataService from '@/data-layer/services/AuthService'
import AuthService from '@/business-layer/services/AuthService'
import { createMockNextPostRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { POST } from './route'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('tests /api/auth/login', async () => {
  const userService = new UserService()
  const authService = new AuthService()
  const authDataService = new AuthDataService()

  const mockSet = vi.fn()
  beforeAll(() => {
    const mockCookieStore: Partial<ReadonlyRequestCookies> = {
      set: mockSet,
    }

    vi.spyOn(nextHeaders, 'cookies').mockImplementation(
      async () => mockCookieStore as ReadonlyRequestCookies,
    )
  })

  it('should login a user', async () => {
    await userService.createUser(clientMock)
    await authDataService.createAuth({
      email: clientMock.email,
      password: await authService.hashPassword('password123'),
    })

    await POST(
      createMockNextPostRequest('/api/auth/login', {
        email: clientMock.email,
        password: 'password123',
      }),
    )

    expect(mockSet).toHaveBeenCalledWith(AUTH_COOKIE_NAME, CLIENT_JWT_MOCK, {
      maxAge: 60 * 60,
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    })
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/client')
  })

  it('should return a 401 if the body is malformed', async () => {
    const response = await POST(
      createMockNextPostRequest('/api/auth/login', {
        password: 'password123',
      }),
    )

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect((await response.json()).error).toBe('Invalid request body')
  })

  it('should return a 401 if the email or password is incorrect', async () => {
    userService.createUser(clientMock)
    await authDataService.createAuth({
      email: clientMock.email,
      password: await authService.hashPassword('password123'),
    })

    const res = await POST(
      createMockNextPostRequest('/api/auth/login', {
        email: clientMock.email,
        password: 'wrongpassword',
      }),
    )
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    expect((await res.json()).error).toBe('Invalid email or password')

    const res2 = await POST(
      createMockNextPostRequest('/api/auth/login', {
        email: 'wrongemail@example.com',
        password: 'password123',
      }),
    )
    expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
    expect((await res2.json()).error).toBe('Invalid email or password')
  })
})
