import { StatusCodes } from 'http-status-codes'

import {
  clearCollection,
  createMockNextPostRequest,
  paramsToPromise,
  testPayloadObject,
} from '@/test-config/utils'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { GET, PATCH } from '@/app/api/semesters/[id]/route'
import { NextRequest } from 'next/server'

describe('/api/admin/semesters/[id]', () => {
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semester')
  })

  describe('GET /api/admin/semesters/[id]', () => {
    it('should get a semester correctly', async () => {
      const newSem = await semesterService.createSemester(semesterCreateMock)
      const slug = { id: newSem.id }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual({ data: newSem })
    })

    it('should return a 404 error if the semester does not exist', async () => {
      const slug = { id: 'nonexistent' }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Semester not found' })
    })
  })

  describe('PATCH /api/admin/semesters/[id]', () => {
    it('should update a semester correctly', async () => {
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
      const res = await PATCH(createMockNextPostRequest('', { name: 'Updated Semester' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual('Semester not found')
    })
  })
})
