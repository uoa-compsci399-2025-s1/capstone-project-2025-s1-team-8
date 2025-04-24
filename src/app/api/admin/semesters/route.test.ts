import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import SemesterService from '@/data-layer/services/SemesterService'
import { POST } from './route'
import { createMockNextPostRequest } from '@/test-config/utils'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/admin/semesters', async() => {
  const semesterService = new SemesterService()
  const cookieStore = await cookies();
  describe('POST /api/admin/semesters', () => {
    it('should return a 401 Unauthorized error if not authenticated', async () => {
      const res = await POST(createMockNextPostRequest('', semesterCreateMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await res.json()
      expect(json.error).toEqual('No token provided')
    })

    it('should return a 401 if user is student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await POST(createMockNextPostRequest('', semesterCreateMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await res.json()
      expect(json.error).toEqual('No scope')

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await POST(createMockNextPostRequest('', semesterCreateMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      const json2 = await res2.json()
      expect(json2.error).toEqual('No scope')
    })

    it('should create a semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(createMockNextPostRequest('', semesterCreateMock))
      expect(res.status).toBe(StatusCodes.CREATED)

      const json = await res.json()
      const fetchedSemester = await semesterService.getSemester(json.id)
      expect(json).toEqual(fetchedSemester)
    })

    it('should error when missing required fields', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(
        createMockNextPostRequest('', { ...semesterCreateMock, name: undefined }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual('Invalid request body')
      expect(json.details.fieldErrors.name[0]).toEqual('Required')
    })

    it('should error if an invalid date is provided', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(
        createMockNextPostRequest('', { ...semesterCreateMock, startDate: 'invalid date' }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual('Invalid request body')
      expect(json.details.fieldErrors.startDate[0]).toEqual(
        'Invalid date format, should be in ISO 8601 format',
      )
    })
  })
})
