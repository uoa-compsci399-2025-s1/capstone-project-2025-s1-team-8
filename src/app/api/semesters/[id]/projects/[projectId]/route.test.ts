import { StatusCodes } from 'http-status-codes'
import {
  createMockNextRequest,
  paramsToPromise,
  createMockNextPatchRequest,
} from '@/test-config/utils'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, PATCH } from '@/app/api/semesters/[id]/projects/[projectId]/route'
import ProjectService from '@/data-layer/services/ProjectService'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterMock } from '@/test-config/mocks/Semester.mock'

const projectService = new ProjectService()
const semesterService = new SemesterService()

describe('test PATCH /api/semesters/[id]/projects/[projectId]', () => {
  it("Should return a 404 error if the project doesn't exist", async () => {
    const res = await PATCH(
      createMockNextPatchRequest('api/semesters/123/projects/123', { semesterProjectCreateMock }),
      {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      },
    )
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect((await res.json()).error).toBe('Project not found!')
  })

  it('Should return a 404 error if the project is not in the semester', async () => {
    const semester = await semesterService.createSemester(semesterMock)
    const semesterProject = await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester.id,
    })
    const res = await PATCH(
      createMockNextPatchRequest(`api/semesters/123/projects/${semesterProject.id}`, {
        ...semesterProjectCreateMock,
        number: 100,
      }),
      {
        params: paramsToPromise({ id: '123', projectId: semesterProject.id }),
      },
    )
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect((await res.json()).error).toBe('Semester not found!')
  })

  it('Should return a 200 response with the project if it exists in the semester', async () => {
    const semester = await semesterService.createSemester(semesterMock)
    const semesterProject = await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester.id,
    })
    const res = await PATCH(
      createMockNextPatchRequest(`api/semesters/${semester.id}/projects/${semesterProject.id}`, {
        ...semesterProject,
        number: 100,
      }),
      {
        params: paramsToPromise({ id: semester.id, projectId: semesterProject.id }),
      },
    )
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual(
      await projectService.getSemesterProject(semesterProject.id),
    )
  })
})

describe('test GET /api/semesters/[id]/projects/[projectId]', () => {
  it("Should return a 404 error if the project doesn't exist", async () => {
    const res = await GET(createMockNextRequest('api/semesters/123/projects/123'), {
      params: paramsToPromise({ id: '123', projectId: '123' }),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect((await res.json()).error).toBe('Project not found!')
  })

  it('Should return a 404 error if the project is not in the semester', async () => {
    const semester = await semesterService.createSemester(semesterMock)
    const semesterProject = await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester.id,
    })
    const res = await GET(
      createMockNextRequest(`api/semesters/123/projects/${semesterProject.id}`),
      {
        params: paramsToPromise({ id: '123', projectId: semesterProject.id }),
      },
    )
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect((await res.json()).error).toBe('Semester not found!')
  })

  it('Should return a 200 response with the project if it exists in the semester', async () => {
    const semester = await semesterService.createSemester(semesterMock)
    const semesterProject = await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester.id,
    })
    const res = await GET(
      createMockNextRequest(`api/semesters/${semester.id}/projects/${semesterProject.id}`),
      {
        params: paramsToPromise({ id: semester.id, projectId: semesterProject.id }),
      },
    )
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual(semesterProject)
  })
})
