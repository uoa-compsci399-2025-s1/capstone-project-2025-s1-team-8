import { StatusCodes } from 'http-status-codes'
import { createMockNextRequest, paramsToPromise } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/semesters/[id]/projects/[projectId]/route'
import { semesterMock } from '@/test-config/mocks/Semester.mock'

describe('test /api/semesters/[id]/projects/[projectId]', () => {
  const projectService = new ProjectService()
  const semesterService = new SemesterService()

  it("Should return a 404 error if the project doesn't exist", async () => {
    const res = await GET(createMockNextRequest('api/semesters/123/projects/123'), {
      params: paramsToPromise({ id: '123', projectId: '123' }),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
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
