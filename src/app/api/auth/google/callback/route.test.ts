import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import * as nextHeaders from 'next/headers'

import { mockClient1 } from '@/test-config/mocks/User.mock'
import {
  authMock,
  CODE_MOCK,
  createMockNextRequest,
  googleUserResponseMock,
  JWT_MOCK,
  JWT_SECRET_MOCK,
  SCOPES_ARRAY_MOCK,
  SCOPES_MOCK,
  STATE_MOCK,
  tokensMock,
} from '@/test-config/mocks/Auth.mock'

vi.mock('@/business-layer/security/google', async () => {
  const actual = await vi.importActual<typeof import('@/business-layer/security/google')>(
    '@/business-layer/security/google',
  )
  return {
    ...actual,
    googleAuthScopes: SCOPES_ARRAY_MOCK,
    oauth2Client: {
      getToken: (code: string) => (code === CODE_MOCK ? { tokens: tokensMock } : null),
    },
  }
})

vi.mock('@/data-layer/services/UserService', () => {
  return {
    default: class {
      getUserByEmail = vi.fn().mockResolvedValue(mockClient1)
      createUser = vi.fn().mockResolvedValue(mockClient1)
    },
  }
})

vi.mock('@/data-layer/services/AuthService', () => {
  return {
    default: class {
      createAuth = vi.fn().mockResolvedValue(authMock)
      getAuthByEmail = vi.fn().mockResolvedValue(authMock)
      updateAuth = vi.fn().mockResolvedValue(authMock)
    },
  }
})

vi.mock('@/business-layer/services/AuthService', () => {
  return {
    default: class {
      generateJWT = vi.fn().mockReturnValue(JWT_MOCK)
    },
  }
})

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

    const mockCookieStore = {
      get: (key: string) => ({ value: key === 'state' ? STATE_MOCK : undefined }),
      set: mockSet,
      delete: vi.fn(),
    }

    vi.spyOn(nextHeaders, 'cookies').mockResolvedValue(
      mockCookieStore as unknown as ReadonlyRequestCookies,
    )

    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  afterEach(() => vi.restoreAllMocks())

  it('should set jwt to cookie', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    await callback(req)

    expect(mockSet).toHaveBeenCalledWith('auth_token', JWT_MOCK, {
      maxAge: 3600,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
  })

  it('returns JWT token on success auth', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(json.token).toBe(JWT_MOCK)
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
