import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { GET } from './route'
import { paramsToPromise } from '@/test-config/utils'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { semesterMock } from '@/test-config/mocks/Semester.mock'

describe('tests /api/admin/export/semesters/[id]', async () => {
  const cookieStore = await cookies()
  const semesterService = new SemesterDataService()

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

    it('should return 200 OK', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterService.createSemester(semesterMock)
      const res = await GET({} as NextRequest, { params: paramsToPromise({ id: semester.id }) })

      expect(res.status).toBe(StatusCodes.OK)
    })
  })
})
