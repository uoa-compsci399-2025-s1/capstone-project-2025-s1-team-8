import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { createMockNextPostRequest, createMockNextRequest } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock, projectCreateMock2 } from '@/test-config/mocks/Project.mock'
import { GET, POST } from './route'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('test /api/projects', async () => {
  const projectService = new ProjectService()
  const cookieStore = await cookies()

  describe('GET /api/projects', () => {
    it('should return a 401 if user is not authenticated', async () => {
      const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })
    })

    it('should get no projects if none are created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return a list of all projects created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return bad Request if limit is more than 100 or less than 1', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/projects?limit=101'))
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const res2 = await GET(createMockNextRequest('http://localhost:3000/api/projects?limit=0'))
      expect(res2.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return a list of all projects created with pagination', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      const res1 = await GET(
        createMockNextRequest('http://localhost:3000/api/projects?page=2&limit=2'),
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const data1 = await res1.json()
      expect(data1.data.length).toEqual(1)
      expect(data1.nextPage).toBeNull()

      const res = await GET(
        createMockNextRequest('http://localhost:3000/api/projects?page=1&limit=1'),
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(1)
      expect(data.nextPage).not.toBeNull()
    })
  })

  describe('POST /api/projects', () => {
    it('should return a 401 if user is not authenticated', async () => {
      const res = await POST(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await POST(createMockNextRequest('http://localhost:3000/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })
    })

    it('should create a project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const req = createMockNextPostRequest('', projectCreateMock)
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      const project = (await res.json()).data
      expect(project).toEqual(await projectService.getProjectById(project.id))

      // Project with client ID's instead of client objects
      const req2 = createMockNextPostRequest(
        'https://localhost:3000/api/projects',
        projectCreateMock2,
      )
      const res2 = await POST(req2)
      expect(res2.status).toBe(StatusCodes.CREATED)
      const project2 = (await res2.json()).data
      expect(project2).toEqual(await projectService.getProjectById(project2.id))
    })

    it('should fail to create a project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextPostRequest('', {
        ...projectCreateMock,
        description: undefined,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })
  })
})
