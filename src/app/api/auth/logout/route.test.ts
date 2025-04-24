import { StatusCodes } from 'http-status-codes'

import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { clientToken } from '@/test-config/routes-setup'
import { cookies } from 'next/headers'

describe('/api/auth/logout', () => {
  it('should return 401 if no auth cookie', async () => {
    const req = createMockNextRequest('/api/auth/logout')
    const res = await GET(req)
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it('should delete auth cookie', async () => {
    const req = createMockNextRequest('/api/auth/logout')
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, clientToken)
    const res = await GET(req)
    expect(res.status).toBe(StatusCodes.OK)
  })
})
