import { StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

import { paramsToPromise } from '@/test-config/utils'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { GET } from '@/app/api/semesters/[id]/route'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { clientToken, studentToken } from '@/test-config/routes-setup'

describe('/api/admin/semesters/[id]', async () => {
  const semesterService = new SemesterService()
  const cookieStore = await cookies()

  describe('GET /api/admin/semesters/[id]', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const slug = { id: 'nonexistent' }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should get a semester correctly', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const newSem = await semesterService.createSemester(semesterCreateMock)
      const slug = { id: newSem.id }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual({ data: newSem })
    })

    it('should return a 404 error if the semester does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const slug = { id: 'nonexistent' }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Semester not found' })
    })
  })
})
