import {
  REDIRECT_URI_MOCK,
  SCOPES_ARRAY_MOCK,
  CLIENT_STATE_MOCK,
} from '@/test-config/mocks/Auth.mock'
import { GET } from './route'
import { redirect } from 'next/navigation'
import { oauth2Client } from '@/business-layer/security/google'
import * as nextHeaders from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { buildNextRequest } from '@/utils/buildNextRequest'

vi.mock('@/business-layer/security/google', () => ({
  oauth2Client: {
    generateAuthUrl: vi.fn().mockReturnValue(REDIRECT_URI_MOCK),
  },
  googleAuthScopes: SCOPES_ARRAY_MOCK,
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    set: vi.fn(),
  }),
}))

// Mock next redirection
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Google Auth tests', async () => {
  const mockSet = vi.fn()
  beforeAll(() => {
    const mockCookieStore: Partial<ReadonlyRequestCookies> = {
      set: mockSet,
    }

    vi.spyOn(nextHeaders, 'cookies').mockImplementation(
      async () => mockCookieStore as ReadonlyRequestCookies,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })

  it('should redirect to Google OAuth URL with state and scopes', async () => {
    await GET(await buildNextRequest('api/auth/google?role=client'))
    expect(redirect).toHaveBeenCalled()
    expect(mockSet).toHaveBeenCalledWith('state', CLIENT_STATE_MOCK, {
      maxAge: 60,
      httpOnly: true,
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production',
    })
    expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith({
      scope: SCOPES_ARRAY_MOCK,
      include_granted_scopes: true,
      state: CLIENT_STATE_MOCK,
    })
    expect(redirect).toHaveBeenCalledWith(
      oauth2Client.generateAuthUrl({
        scope: SCOPES_ARRAY_MOCK,
        include_granted_scopes: true,
        state: CLIENT_STATE_MOCK,
      }),
    )
    expect(redirect).toHaveBeenCalledWith(REDIRECT_URI_MOCK)
  })
})
