import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { createMockNextRequest, paramsToPromise } from '@/test-config/utils'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from './route'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { clientMock } from '@/test-config/mocks/Auth.mock'

describe('test /api/admin/users/[id]/projects', async () => {
  const projectService = new ProjectDataService()
  const cookieStore = await cookies()

  describe('GET /api/admin/users/[id]/projects', () => {
    it('should return a 401 if no cookie is provided', async () => {
      const res = await GET(createMockNextRequest('api/admin/users/123/projects'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is not an admin', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('api/admin/users/123/projects'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await GET(createMockNextRequest('api/admin/users/123/projects'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should get no projects if none are created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('api/admin/users/123/projects'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Client not found')
    })

    it('should return a list of all projects for a user', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      const res = await GET(createMockNextRequest(`api/admin/users/${clientMock.id}/projects`), {
        params: paramsToPromise({ id: clientMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return a list of no projects for a user who has no projects', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest(`api/admin/users/${clientMock.id}/projects`), {
        params: paramsToPromise({ id: clientMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return bad request if limit is more than 100 or less than 1', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('api/admin/users/123/projects?limit=101'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const res2 = await GET(createMockNextRequest('api/admin/users/123/projects?limit=0'), {
        params: paramsToPromise({ id: '123' }),
      })
      expect(res2.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return a list of all projects that a client is involved in with pagination', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      await projectService.createProject(projectCreateMock)
      const res1 = await GET(
        createMockNextRequest(`api/admin/users/${clientMock.id}/projects?page=2&limit=2`),
        { params: paramsToPromise({ id: clientMock.id }) },
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const data1 = await res1.json()
      expect(data1.data.length).toEqual(1)
      expect(data1.nextPage).toBeNull()

      const res = await GET(
        createMockNextRequest(`api/admin/users/${clientMock.id}/projects?page=1&limit=1`),
        { params: paramsToPromise({ id: clientMock.id }) },
      )
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(1)
      expect(data.nextPage).not.toBeNull()
    })
  })
})
