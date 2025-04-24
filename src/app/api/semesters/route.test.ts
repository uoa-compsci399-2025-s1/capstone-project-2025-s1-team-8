import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import SemesterService from '@/data-layer/services/SemesterService'
import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { semesterCreateMock, semesterCreateMock2 } from '@/test-config/mocks/Semester.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/semesters', async() => {
  const semesterService = new SemesterService()
  const cookieStore = await cookies()

  describe('GET /api/semesters', () => {
    it('should return a 401 if not authenticated', async () => {
      const res = await GET(createMockNextRequest('http://localhost:3000/api/semesters'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should get no semesters if none exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/semesters'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return a list of all semester created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      await semesterService.createSemester(semesterCreateMock)
      await semesterService.createSemester(semesterCreateMock2)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/semesters'))
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return a list of all semesters created with pagination', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await semesterService.createSemester(semesterCreateMock)
      await semesterService.createSemester(semesterCreateMock)
      await semesterService.createSemester(semesterCreateMock)
      const res1 = await GET(
        createMockNextRequest('http://localhost:3000/api/semester?page=2&limit=2'),
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const data1 = await res1.json()
      expect(data1.data.length).toEqual(1)
      expect(data1.nextPage).toBeNull()

      const res = await GET(
        createMockNextRequest('http://localhost:3000/api/semester?page=1&limit=1'),
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(1)
      expect(data.nextPage).not.toBeNull()
    })
  })
})
