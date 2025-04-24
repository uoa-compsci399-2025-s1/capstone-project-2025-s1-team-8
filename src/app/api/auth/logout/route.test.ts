import * as nextHeaders from 'next/headers'

import { GET } from './route'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { AUTH_COOKIE_NAME } from '@/types/Auth'

const mockDelete = vi.fn()

describe('/api/auth/logout', () => {
  beforeAll(() => {
    const mockCookieStore = {
      delete: mockDelete,
    }

    vi.mock('next/headers', () => ({
      cookies: () => ({
        delete: mockDelete,
      }),
    }))

    vi.spyOn(nextHeaders, 'cookies').mockResolvedValue(
      mockCookieStore as unknown as ReadonlyRequestCookies,
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should delete auth cookie', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    expect(mockDelete).toHaveBeenCalledWith(AUTH_COOKIE_NAME)
  })
})
