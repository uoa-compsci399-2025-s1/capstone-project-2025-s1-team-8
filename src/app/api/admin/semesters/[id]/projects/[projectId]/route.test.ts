import { StatusCodes } from 'http-status-codes'
import {
  createMockNextPatchRequest,
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { semesterProjectCreateMock, semesterProjectMock5 } from '@/test-config/mocks/Project.mock'
import { PATCH, DELETE } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterCreateMock, semesterMock } from '@/test-config/mocks/Semester.mock'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('test api/semester/[id]/projects[/projectId]', async () => {
  const projectService = new ProjectService()
  const semesterService = new SemesterService()
  const cookieStore = await cookies()

  describe('test PATCH /api/semesters/[id]/projects/[projectId]', () => {
    it('return 401 with no auth', async () => {
      const res = await PATCH(createMockNextPatchRequest('', { semesterProjectCreateMock }), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('return 401 if not admin', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await PATCH(createMockNextPatchRequest('', { semesterProjectCreateMock }), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await PATCH(createMockNextPatchRequest('', { semesterProjectCreateMock }), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res2.json()).error).toBe('No scope')
    })

    it("Should return a 404 error if the semester doesn't exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(
        createMockNextPatchRequest('api/semesters/123/projects/123', { semesterProjectCreateMock }),
        {
          params: paramsToPromise({ id: '123', projectId: '123' }),
        },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Semester not found')
    })

    it("Should return a 404 error if the project doesn't exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterService.createSemester(semesterMock)
      const res = await PATCH(createMockNextPatchRequest('', { semesterProjectCreateMock }), {
        params: paramsToPromise({ id: semester.id, projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Project not found')
    })

    it('Should return a 404 error if the project is not in the semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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
      expect((await res.json()).error).toBe('Semester not found')
    })

    it('Should return a 200 response with the project if it exists in the semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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

  describe('test DELETE /api/semesters/[id]/projects/[projectId]', async () => {
    it('return 401 with no auth', async () => {
      const res = await DELETE(createMockNextRequest(`api/semesters/123/projects/123`), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('return 401 if not admin', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await DELETE(createMockNextRequest(`api/semesters/123/projects/123`), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await DELETE(createMockNextRequest(`api/semesters/123/projects/123`), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res2.json()).error).toBe('No scope')
    })

    it('not found - delete project by non existent project ID', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semesterService = new SemesterService()
      const createdSemester = await semesterService.createSemester(semesterMock)
      const id = createdSemester.id
      const res = await DELETE(
        createMockNextRequest(`api/semesters/${id}/projects/'non-existent'`),
        {
          params: paramsToPromise({ id: createdSemester.id, projectId: 'non-existent' }),
        },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const jsonResponse = await res.json()
      expect(jsonResponse.error).toBe('Project not found')
    })

    it('not found - delete project by non existent semester ID', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const createdSemester = await semesterService.createSemester(semesterMock)
      const createdSemesterProject = await projectService.createSemesterProject({
        ...semesterProjectMock5,
        semester: createdSemester.id,
      })
      const projectId = createdSemesterProject.id
      const res = await DELETE(
        createMockNextRequest(`api/semesters/'non-existent'/projects/${projectId}`),
        {
          params: paramsToPromise({ id: 'non-existent', projectId: projectId }),
        },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const jsonResponse = await res.json()
      expect(jsonResponse.error).toBe('Semester not found')
    })

    it('delete a semester project with affiliated semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semesterService = new SemesterService()
      const createdSemester = await semesterService.createSemester(semesterMock)
      const createdSemesterProject = await projectService.createSemesterProject({
        ...semesterProjectMock5,
        semester: createdSemester.id,
      })
      const id = createdSemester.id
      const projectId = createdSemesterProject.id
      const res = await DELETE(
        createMockNextRequest(`api/admin/semesters/${id}/projects/${projectId}`),
        {
          params: paramsToPromise({ id: createdSemester.id, projectId: createdSemesterProject.id }),
        },
      )
      expect(res.status).toBe(StatusCodes.OK)
    })

    it('bad request - delete a semester project with not affiliated semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semesterService = new SemesterService()
      const createdSemester = await semesterService.createSemester(semesterCreateMock)
      const createdSemesterProject = await projectService.createSemesterProject({
        ...semesterProjectMock5,
        semester: createdSemester.id,
      })
      const wrongSemester = await semesterService.createSemester(semesterMock)
      const id = wrongSemester.id
      const projectId = createdSemesterProject.id
      const res = await DELETE(
        createMockNextRequest(`api/admin/semesters/${id}/projects/${projectId}`),
        {
          params: paramsToPromise({ id: wrongSemester.id, projectId: createdSemesterProject.id }),
        },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })
  })
})
