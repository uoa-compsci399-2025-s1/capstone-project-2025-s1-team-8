import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

import {
  createMockNextPatchRequest,
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, PATCH, DELETE } from '@/app/api/projects/[id]/route'
import { adminMock, clientMock } from '@/test-config/mocks/Auth.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/projects/[id]', async () => {
  const projectService = new ProjectService()
  const cookieStore = await cookies()
  describe('GET /api/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should get a project correctly', async () => {
      const project = await projectService.createProject(projectCreateMock)
      const slug = { id: project.id }
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual({ data: project })
    })

    it('should return a 404 error if the project does not exist', async () => {
      const slug = { id: 'nonexistent' }
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })

  describe('PATCH /api/admin/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'poop' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should update a project correctly', async () => {
      const project = await projectService.createProject({
        ...projectCreateMock,
        clients: [clientMock, adminMock],
      })
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const body = await res.json()
      expect(body.data.name).toEqual('Updated project')

      const res1 = await PATCH(
        createMockNextPatchRequest('', { name: 'Updated project 1', description: 'Hi hi' }),
        {
          params: paramsToPromise({ id: project.id }),
        },
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const body1 = await res1.json()
      expect(body1.data.name).toEqual('Updated project 1')
      expect(body1.data.description).toEqual('Hi hi')
    })

    it('should return a 404 error if the project does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })

    it("should 401 if the project client doesn't match", async () => {
      const project = await projectService.createProject(projectCreateMock)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })
  })

  describe('DELETE /api/admin/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'hhhhh' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should delete a project correctly', async () => {
      const project = await projectService.createProject({
        ...projectCreateMock,
        clients: [clientMock],
      })
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const slug = { id: project.id }
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect((await projectService.getAllProjects()).docs.length).toEqual(0)
    })

    it('should return a 404 error if the project does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const slug = { id: 'nonexistent' }
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })
})
