import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import {
  createMockNextRequest,
  paramsToPromise,
  createMockNextPostRequest,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import {
  projectMock,
  semesterProjectCreateMock,
  semesterProjectCreateMock2,
} from '@/test-config/mocks/Project.mock'
import { GET, POST } from '@/app/api/semesters/[id]/projects/route'
import { semesterMock } from '@/test-config/mocks/Semester.mock'
import { ProjectStatus } from '@/types/Project'
import SemesterService from '@/data-layer/services/SemesterService'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/semesters/[id]/projects', async () => {
  const projectService = new ProjectService()
  const semesterService = new SemesterService()

  const cookieStore = await cookies()

  describe('GET /api/semesters/[id]/projects', () => {
    it('should return a 401 if the user is not authenticated or is a client', async () => {
      const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects`), {
        params: paramsToPromise({ id: semesterMock.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toEqual('No token provided')

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects`), {
        params: paramsToPromise({ id: semesterMock.id }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res2.json()).error).toEqual('No scope')
    })

    it('should return published projects only if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      await projectService.createSemesterProject({ ...semesterProjectCreateMock, published: true })
      const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects`), {
        params: paramsToPromise({ id: semesterMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(1)
    })

    it('should return a list of all semesterprojects for a semester', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      const res = await GET(createMockNextRequest(`api/semesters/${semesterMock.id}/projects`), {
        params: paramsToPromise({ id: semesterMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return a list of no semesterprojects for a semester which has no projects', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      const res = await GET(createMockNextRequest('api/semesters/123/projects'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return bad Request if limit is more than 100 or less than 1', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
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

    it('should return a list of semesterprojects filtered by status', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Approved,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Rejected,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Approved,
      })

      const res = await GET(
        createMockNextRequest(`api/semesters/${semesterMock.id}/projects?status=approved`),
        { params: paramsToPromise({ id: semesterMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return a list of semesterprojects filtered by published status', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        published: true,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        published: false,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        published: true,
      })

      const res = await GET(
        createMockNextRequest(`api/semesters/${semesterMock.id}/projects?published=true`),
        { params: paramsToPromise({ id: semesterMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return bad Request if status is not valid', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(
        createMockNextRequest(`api/semesters/${semesterMock.id}/projects?status=invalid`),
        { params: paramsToPromise({ id: semesterMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return bad Request if published is not true or false', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(
        createMockNextRequest(`api/semesters/${semesterMock.id}/projects?published=invalid`),
        { params: paramsToPromise({ id: semesterMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return a list of semesterprojects filtered by status and published status', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Approved,
        published: true,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Rejected,
        published: false,
      })
      await projectService.createSemesterProject({
        ...semesterProjectCreateMock,
        status: ProjectStatus.Approved,
        published: true,
      })

      const res = await GET(
        createMockNextRequest(
          `api/semesters/${semesterMock.id}/projects?status=approved&published=true`,
        ),
        { params: paramsToPromise({ id: semesterMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })
  })

  describe('POST /api/semesters/[id]/projects', () => {
    it('should 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await POST(
        createMockNextPostRequest(`api/semesters/abc/projects`, {
          ...semesterProjectCreateMock2,
          project: 'project.id',
        }),
        { params: paramsToPromise({ id: 'a' }) },
      )
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')
    })

    it('should create a new semester project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterService.createSemester(semesterMock)
      const project = await projectService.createProject(projectMock)
      const res = await POST(
        createMockNextPostRequest(`api/semesters/${semester.id}/projects`, {
          ...semesterProjectCreateMock2,
          project: project.id,
        }),
        { params: paramsToPromise({ id: semester.id }) },
      )
      expect(res.status).toBe(StatusCodes.CREATED)
      const data = await res.json()
      expect(data.data).toEqual(await projectService.getSemesterProject(data.data.id))
    })

    it('should return a 404 if the project is not found', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterService.createSemester(semesterMock)
      const res = await POST(
        createMockNextPostRequest(`api/semesters/${semester.id}/projects`, {
          ...semesterProjectCreateMock2,
          project: '123',
        }),
        { params: paramsToPromise({ id: semester.id }) },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Project not found')
    })

    it('should return a 401 if the project is not associated with the client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const semester = await semesterService.createSemester(semesterMock)
      const project = await projectService.createProject(projectMock)
      const res = await POST(
        createMockNextPostRequest(`api/semesters/${semester.id}/projects`, {
          ...semesterProjectCreateMock2,
          project: project.id,
        }),
        { params: paramsToPromise({ id: semester.id }) },
      )
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('The project is not associated with the user')
    })

    it('should fail to create a new semester project if body is invalid', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterService.createSemester(semesterMock)

      const res = await POST(
        createMockNextPostRequest(`api/semesters/${semester.id}/projects`, {
          ...semesterProjectCreateMock2,
          status: undefined,
        }),
        { params: paramsToPromise({ id: semester.id }) },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should fail to create a new semester project if semester is not found', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(
        createMockNextPostRequest(`api/semesters/123/projects`, semesterProjectCreateMock2),
        { params: paramsToPromise({ id: '123' }) },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Semester not found')
    })
  })
})
