import { clientToken, studentToken } from '@/test-config/routes-setup'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { cookies } from 'next/headers'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { paramsToPromise } from '@/test-config/utils'
import { StatusCodes } from 'http-status-codes'

describe('tests /api/admin/export/semesters/[id]', async () => {
  const cookieStore = await cookies()
  describe('GET', () => {
    it('should return a 401 if the user is not authenticated', async () => {
      const res = await GET({} as NextRequest, { params: paramsToPromise({ id: 'a' }) })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is not an admin', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET({} as NextRequest, { params: paramsToPromise({ id: 'a' }) })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await GET({} as NextRequest, { params: paramsToPromise({ id: 'a' }) })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })
  })
})
