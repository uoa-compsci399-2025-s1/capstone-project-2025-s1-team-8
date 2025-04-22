import { REDIRECT_URI_MOCK, SCOPES_ARRAY_MOCK, STATE_MOCK } from '@/test-config/mocks/Auth.mock'
import { GET } from './route'
import { redirect } from 'next/navigation'
import { oauth2Client } from '@/business-layer/security/google'
import * as nextHeaders from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

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
    // stubGlobal changes the values of global variables
    vi.stubGlobal('crypto', {
      randomUUID: () => STATE_MOCK,
    })

    const mockCookieStore: Partial<ReadonlyRequestCookies> = {
      set: mockSet,
    }

    vi.spyOn(nextHeaders, 'cookies').mockImplementation(
      async () => mockCookieStore as ReadonlyRequestCookies,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should redirect to Google OAuth URL with state and scopes', async () => {
    await GET()
    expect(redirect).toHaveBeenCalled()
    expect(mockSet).toHaveBeenCalledWith('state', STATE_MOCK, {
      maxAge: 60,
      httpOnly: true,
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production',
    })
    expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith({
      scope: SCOPES_ARRAY_MOCK,
      include_granted_scopes: true,
      state: STATE_MOCK,
    })
    expect(redirect).toHaveBeenCalledWith(
      oauth2Client.generateAuthUrl({
        scope: SCOPES_ARRAY_MOCK,
        include_granted_scopes: true,
        state: STATE_MOCK,
      }),
    )
    expect(redirect).toHaveBeenCalledWith(REDIRECT_URI_MOCK)
  })
})
