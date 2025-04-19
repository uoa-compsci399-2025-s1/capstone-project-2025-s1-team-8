import jwt from 'jsonwebtoken'

import { mockClient1 } from '@/test-config/mocks/User.mock'

import {
  authMock,
  CODE_MOCK,
  createMockNextRequest,
  googleUserResponseMock,
  JWT_SECRET_MOCK,
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
    oauth2Client: {
      getToken: vi.fn().mockResolvedValue({
        tokens: tokensMock,
      }),
    },
  }
})

vi.mock('@/data-layer/services/UserService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getUserByEmail: vi.fn().mockResolvedValue(mockClient1),
      createUser: vi.fn().mockResolvedValue(mockClient1),
    })),
  }
})

vi.mock('@/data-layer/services/AuthService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createAuth: vi.fn().mockResolvedValue(authMock),
    })),
  }
})

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: (key: string) => ({ value: key === 'state' ? STATE_MOCK : undefined }),
    delete: vi.fn(),
  }),
}))

import { GET as callback } from '@/app/api/auth/google/callback/route'

describe('GET /api/auth/google/callback', () => {
  beforeAll(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: vi.fn().mockResolvedValue(googleUserResponseMock),
    } as unknown as Response)

    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns JWT token on success auth', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=${STATE_MOCK}&scope=${SCOPES_MOCK}`,
    )
    req.cookies.set('state', STATE_MOCK)

    const response = await callback(req)
    const json = await response.json()

    expect(json.token).toBeDefined()

    const decoded = jwt.verify(json.token, process.env.JWT_SECRET)

    expect(decoded).toMatchObject({
      profile: mockClient1,
      accessToken: tokensMock.access_token,
    })
  })

  it('returns 400 if state does not match', async () => {
    const req = createMockNextRequest(
      `/api/auth/google/callback?code=${CODE_MOCK}&state=wrong_state&scope=${SCOPES_MOCK}}`,
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
