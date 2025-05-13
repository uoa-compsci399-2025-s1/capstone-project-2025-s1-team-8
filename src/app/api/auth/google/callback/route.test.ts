import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { StatusCodes } from 'http-status-codes'
import * as nextHeaders from 'next/headers'
import { redirect } from 'next/navigation'

import {
  CODE_MOCK,
  googleUserResponseMock,
  JWT_MOCK,
  SCOPES_MOCK,
  CLIENT_STATE_MOCK,
} from '@/test-config/mocks/Auth.mock'
import { createMockNextRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import AuthService from '@/data-layer/services/AuthService'
import { GET as callback } from '@/app/api/auth/google/callback/route'
import UserService from '@/data-layer/services/UserService'

const mockSet = vi.fn()

describe('GET /api/auth/google/callback', () => {
  const authDataService = new AuthService()
  const userService = new UserService()

  beforeAll(() => {
    vi.stubGlobal('fetch', (url: string) =>
      url === 'https://www.googleapis.com/oauth2/v3/userinfo'
        ? { json: () => googleUserResponseMock }
        : null,
    )

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: vi.fn().mockResolvedValue(googleUserResponseMock),
    } as unknown as Response)

    vi.mock('next/headers', () => ({
      cookies: () => ({
        get: (key: string) => ({ value: key === 'state' ? CLIENT_STATE_MOCK : undefined }),
        set: mockSet,
        delete: vi.fn(),
      }),
    }))

    vi.mock('next/navigation', () => ({
      redirect: vi.fn(),
    }))

    const mockCookieStore = {
      get: (key: string) => ({ value: key === 'state' ? CLIENT_STATE_MOCK : undefined }),
      set: mockSet,
      delete: vi.fn(),
    }

    vi.spyOn(nextHeaders, 'cookies').mockResolvedValue(
      mockCookieStore as unknown as ReadonlyRequestCookies,
    )
  })

  afterEach(() => vi.restoreAllMocks())

  it('should set jwt to cookie', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${CLIENT_STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    await callback(req)

    expect(mockSet).toHaveBeenCalledWith(AUTH_COOKIE_NAME, JWT_MOCK, {
      maxAge: 3600,
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    })
  })

  it('should return the correct redirection', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${CLIENT_STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    await callback(req)
    expect(redirect).toHaveBeenCalledWith('/client')
  })

  it('should create a new auth and user document with the google user response data', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${CLIENT_STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    await callback(req)
    const auth = await authDataService.getAuthByEmail(googleUserResponseMock.email)
    expect(auth.email).toBe(googleUserResponseMock.email)
    const user = await userService.getUserByEmail(googleUserResponseMock.email)
    expect(user.email).toBe(googleUserResponseMock.email)
  })

  it('should modify an existing user with the google user response data', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${CLIENT_STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    const createdUser = await userService.createUser({
      firstName: 'lol',
      lastName: 'lolol',
      role: 'client',
      email: googleUserResponseMock.email,
    })

    await callback(req)

    const user = await userService.getUserByEmail(googleUserResponseMock.email)
    expect(user).toStrictEqual({
      ...createdUser,
      firstName: googleUserResponseMock.given_name,
      lastName: googleUserResponseMock.family_name,
      updatedAt: user.updatedAt,
    })
  })

  it('returns 400 if state does not match', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe("State missing or state doesn't match browser state. ")
  })

  it('returns 400 if code is missing', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${CLIENT_STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', CLIENT_STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe('No code provided')
  })
})
