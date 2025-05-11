import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import * as nextHeaders from 'next/headers'
import { redirect } from 'next/navigation'

import {
  CODE_MOCK,
  googleUserResponseMock,
  JWT_MOCK,
  SCOPES_MOCK,
  STATE_MOCK,
} from '@/test-config/mocks/Auth.mock'
import { createMockNextRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'

import { GET as callback } from '@/app/api/auth/google/callback/route'

const mockSet = vi.fn()

describe('GET /api/auth/google/callback', () => {
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
        get: (key: string) => ({ value: key === 'state' ? STATE_MOCK : undefined }),
        set: mockSet,
        delete: vi.fn(),
      }),
    }))

    vi.mock('next/navigation', () => ({
      redirect: vi.fn(),
    }))

    const mockCookieStore = {
      get: (key: string) => ({ value: key === 'state' ? STATE_MOCK : undefined }),
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
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

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
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    await callback(req)
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/client')
  })

  it('returns 400 if state does not match', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe("State missing, or state doesn't match browser state. ")
  })

  it('returns 400 if code is missing', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No code provided')
  })
})
