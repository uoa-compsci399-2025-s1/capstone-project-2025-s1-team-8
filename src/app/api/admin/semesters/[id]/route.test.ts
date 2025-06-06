import type { NextRequest } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { createMockNextPostRequest, paramsToPromise } from '@/test-config/utils'
import { PATCH, DELETE } from './route'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/admin/semesters/[id]', async () => {
  const semesterService = new SemesterDataService()
  const cookieStore = await cookies()

  describe('PATCH /api/admin/semesters/[id]', () => {
    it('should 401 if no user is authenticated', async () => {
      const res = await PATCH({} as NextRequest, { params: paramsToPromise({ id: 'nonexistent' }) })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await PATCH({} as NextRequest, { params: paramsToPromise({ id: 'nonexistent' }) })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should update a semester correctly', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSem = await semesterService.createSemester(semesterCreateMock)
      const updatedSem = { name: 'Updated Semester' }

      const res = await PATCH(createMockNextPostRequest('', updatedSem), {
        params: paramsToPromise({ id: newSem.id }),
      })
      const fetchedSem = await semesterService.getSemester(newSem.id)
      expect(res.status).toBe(StatusCodes.OK)
      expect(fetchedSem.name).toEqual(updatedSem.name)
      expect(fetchedSem.updatedAt).not.toEqual(newSem.updatedAt)
      expect(fetchedSem.createdAt).toEqual(newSem.createdAt)
    })

    it('should return a 400 error if the request body is invalid', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSem = await semesterService.createSemester(semesterCreateMock)
      const updatedSem = { deadline: 1 }

      const res = await PATCH(createMockNextPostRequest('', updatedSem), {
        params: paramsToPromise({ id: newSem.id }),
      })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual('Invalid request body')
      expect(json.details.fieldErrors.deadline[0]).toEqual('Expected string, received number')
    })

    it('should return a 404 error if the semester does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextPostRequest('', { name: 'Updated Semester' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual('Semester not found')
    })
  })

  describe('DELETE /api/admin/semesters/[id]', () => {
    it('should 401 if no user is authenticated', async () => {
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should delete a semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterService.createSemester(semesterCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(semesterService.getSemester(newSemester.id)).rejects.toThrow('Not Found')
    })

    it('should return a 404 error if the semester does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE({} as NextRequest, { params: paramsToPromise({ id: 'poop' }) })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
