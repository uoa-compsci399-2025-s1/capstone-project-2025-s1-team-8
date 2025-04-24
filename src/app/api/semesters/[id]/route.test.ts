import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

import { paramsToPromise } from '@/test-config/utils'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { GET } from '@/app/api/semesters/[id]/route'

describe('/api/admin/semesters/[id]', () => {
  const semesterService = new SemesterService()

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
})
