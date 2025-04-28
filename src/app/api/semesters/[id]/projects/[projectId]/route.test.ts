import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import {
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/semesters/[id]/projects/[projectId]/route'
import ProjectService from '@/data-layer/services/ProjectService'
import SemesterService from '@/data-layer/services/SemesterService'
import { semesterMock } from '@/test-config/mocks/Semester.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/semesters/[id]/projects/[projectId]', async() => {
  const cookieStore = await cookies()
  const projectService = new ProjectService()
  const semesterService = new SemesterService()

  describe("GET /api/semesters/[id]/projects/[projectId]", ()=>{
    it('should return a 401 if the user is not authenticated', async () => {
      const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects/123`), {
        params: paramsToPromise({ id: semesterMock.id, projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('should return a 401 if the user is a client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects/123`), {
        params: paramsToPromise({ id: semesterMock.id, projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')
    })

    it("should return a 404 error if the semester doesn't exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('api/semesters/123/projects/123'), {
        params: paramsToPromise({ id: '123', projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Semester not found')
    })

    it("should return a 404 error if the project doesn't exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const semester = await semesterService.createSemester(semesterMock)
      const res = await GET(createMockNextRequest(`api/semesters/${semester.id}/projects/123`), {
        params: paramsToPromise({ id: semester.id, projectId: '123' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Project not found')
    })

    it('should return a 404 error if the project is not in the semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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
      expect((await res.json()).error).toBe('Semester not found')
    })

    it('should return a 401 if the student requested an unpublished project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
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
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')
    })

    it('should return a 200 response with the project if it exists in the semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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
})
