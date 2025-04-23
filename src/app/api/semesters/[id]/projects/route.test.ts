import { StatusCodes } from 'http-status-codes'
import {
  clearCollection,
  testPayloadObject,
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/semesters/[id]/projects/route'
import { semesterMock } from '@/test-config/mocks/Semester.mock'

describe('test /api/semesters/[id]/projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semesterProject')
  })

  const projectService = new ProjectService()

  it('should get no semesterprojects if none are created', async () => {
    const res = await GET(createMockNextRequest('api/semesters/123/projects'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual([])
  })

  it('should return a list of all semesterprojects for a semester', async () => {
    await projectService.createSemesterProject(semesterProjectCreateMock)
    await projectService.createSemesterProject(semesterProjectCreateMock)
    const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects`), {
      params: paramsToPromise({ id: semesterMock.id }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(2)
  })

  it('Should return a list of no semesterprojects for a semester which has no projects', async () => {
    await projectService.createSemesterProject(semesterProjectCreateMock)
    await projectService.createSemesterProject(semesterProjectCreateMock)
    const res = await GET(createMockNextRequest('api/semesters/123/projects'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual([])
  })

  it('should return bad Request if limit is more than 100 or less than 1', async () => {
    const res = await GET(createMockNextRequest('api/semesters/123/projects?limit=101'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    const res2 = await GET(createMockNextRequest('api/semesters/123/projects?limit=0'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res2.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it('should return a list of all semesterprojects from a semester with pagination', async () => {
    await projectService.createSemesterProject(semesterProjectCreateMock)
    await projectService.createSemesterProject(semesterProjectCreateMock)
    await projectService.createSemesterProject(semesterProjectCreateMock)
    const res1 = await GET(
      createMockNextRequest(`api/semesters/${semesterMock.id}/projects?page=2&limit=2`),
      { params: paramsToPromise({ id: semesterMock.id }) },
    )
    expect(res1.status).toBe(StatusCodes.OK)
    const data1 = await res1.json()
    expect(data1.data.length).toEqual(1)
    expect(data1.nextPage).toBeNull()

    const res = await GET(
      createMockNextRequest(`api/semesters/${semesterMock.id}/projects?page=1&limit=1`),
      { params: paramsToPromise({ id: semesterMock.id }) },
    )
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(1)
    expect(data.nextPage).not.toBeNull()
  })
})
