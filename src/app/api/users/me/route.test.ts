import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { adminMock, clientMock, studentMock } from '@/test-config/mocks/Auth.mock'

describe('tests /api/users/me', async () => {
  const cookieStore = await cookies()

  describe('GET /api/users/me', () => {
    it('should return a 401 if no user is authenticated', async () => {
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('should return student user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(studentMock)
    })

    it('should return client user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(clientMock)
    })

    it('should return admin user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(adminMock)
    })
  })
})
