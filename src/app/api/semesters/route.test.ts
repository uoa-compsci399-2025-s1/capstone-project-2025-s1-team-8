import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { semesterCreateMock, semesterCreateMock2 } from '@/test-config/mocks/Semester.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { SemesterType } from '@/types/Semester'

describe('tests /api/semesters', async () => {
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe('GET /api/semesters', () => {
    it('should return a 401 if not authenticated', async () => {
      const res = await GET(createMockNextRequest('/api/semesters'))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should get no semesters if none exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)

      const res = await GET(createMockNextRequest('/api/semesters'))

      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return a list of all semester created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const semester1 = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock2)

      const res = await GET(createMockNextRequest('/api/semesters'))
      expect(res.status).toBe(StatusCodes.OK)

      const data = await res.json()
      expect(data.data).toStrictEqual(expect.arrayContaining([semester1, semester2]))
    })

    it('should return a 400 bad request if the timeframe is invalid', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)

      const res = await GET(createMockNextRequest('/api/semesters?timeframe=invalid'))

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toEqual({ error: 'Invalid timeframe provided' })
    })

    it('should filter the semesters based on timeframe', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const pastSemester = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: new Date('2023-01-01').toISOString(),
        endDate: new Date('2023-06-30').toISOString(),
      })

      const today = new Date()
      const upcomingSemester = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: new Date(
          today.getFullYear() + 1,
          today.getMonth(),
          today.getDate(),
        ).toISOString(),
        endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
      })

      const upcomingSemester2 = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: new Date(
          today.getFullYear() + 2,
          today.getMonth(),
          today.getDate(),
        ).toISOString(),
        endDate: new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()).toISOString(),
      })

      const currentSemester = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate(),
        ).toISOString(),
        endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
      })

      const pastSemesters = await GET(
        createMockNextRequest(`/api/semesters?timeframe=${SemesterType.Past}`),
      )
      expect(pastSemesters.status).toBe(StatusCodes.OK)
      expect((await pastSemesters.json()).data).toStrictEqual([pastSemester])

      const currentSemesters = await GET(
        createMockNextRequest(`/api/semesters?timeframe=${SemesterType.Current}`),
      )
      expect(currentSemesters.status).toBe(StatusCodes.OK)
      expect((await currentSemesters.json()).data).toStrictEqual([currentSemester])

      const upcomingSemesters = await GET(
        createMockNextRequest(`/api/semesters?timeframe=${SemesterType.Upcoming}`),
      )
      expect(upcomingSemesters.status).toBe(StatusCodes.OK)
      expect((await upcomingSemesters.json()).data).toStrictEqual(
        expect.arrayContaining([upcomingSemester, upcomingSemester2]),
      )

      const nextSemester = await GET(
        createMockNextRequest(`/api/semesters?timeframe=${SemesterType.Next}`),
      )
      expect(nextSemester.status).toBe(StatusCodes.OK)
      expect((await nextSemester.json()).data).toStrictEqual([upcomingSemester])
    })
  })
})
