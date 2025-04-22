import { StatusCodes } from 'http-status-codes'

import SemesterService from '@/data-layer/services/SemesterService'
import { POST, GET } from './route'
import {
  clearCollection,
  createMockNextPostRequest,
  createMockNextRequest,
  testPayloadObject,
} from '@/test-config/utils'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'

describe('tests /api/admin/semesters', () => {
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semester')
  })

  describe('POST /api/admin/semesters', () => {
    it('should create a semester', async () => {
      const res = await POST(createMockNextPostRequest('', semesterCreateMock))
      expect(res.status).toBe(StatusCodes.CREATED)

      const json = await res.json()
      const fetchedSemester = await semesterService.getSemester(json.id)
      expect(json).toEqual(fetchedSemester)
    })

    it('should error when missing required fields', async () => {
      const res = await POST(
        createMockNextPostRequest('', { ...semesterCreateMock, name: undefined }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual('Invalid request body')
      expect(json.details.fieldErrors.name[0]).toEqual('Required')
    })

    it('should error if an invalid date is provided', async () => {
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

  describe('GET /api/admin/semesters', () => {

    it('should get no semesters if none exist', async () => {
      const res = await GET(createMockNextRequest('http://localhost:3000/api/semesters'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return a list of all semester created', async () => {
      await semesterService.createSemester(semesterCreateMock)
      await semesterService.createSemester(semesterCreateMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/semesters'))
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })
  })

  it('should return a list of all semesters created with pagination', async () => {
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
