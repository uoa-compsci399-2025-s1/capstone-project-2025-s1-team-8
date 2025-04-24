import { StatusCodes } from 'http-status-codes'
import {
  createMockNextPatchRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { DELETE, PATCH } from './route'
import { NextRequest } from 'next/server'

describe('tests /api/admin/projects/[id]', () => {
  const projectService = new ProjectService()

  describe('PATCH /api/admin/projects/[id]', () => {
    it('should update a project correctly', async () => {
      const project = await projectService.createProject(projectCreateMock)
      const slug = { id: project.id }
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const body = await res.json()
      expect(body.data.name).toEqual('Updated project')

      const res1 = await PATCH(
        createMockNextPatchRequest('', { name: 'Updated project 1', description: 'Hi hi' }),
        {
          params: paramsToPromise(slug),
        },
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const body1 = await res1.json()
      expect(body1.data.name).toEqual('Updated project 1')
      expect(body1.data.description).toEqual('Hi hi')
    })

    it('should return a 404 error if the project does not exist', async () => {
      const slug = { id: 'nonexistent' }
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })

  describe('DELETE /api/admin/projects/[id]', () => {
    it('should delete a project correctly', async () => {
      const project = await projectService.createProject(projectCreateMock)
      const slug = { id: project.id }
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect((await projectService.getAllProjects()).docs.length).toEqual(0)
    })

    it('should return a 404 error if the project does not exist', async () => {
      const slug = { id: 'nonexistent' }
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })
})
