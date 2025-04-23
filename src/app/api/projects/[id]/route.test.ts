import { StatusCodes } from 'http-status-codes'
import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/projects/[id]/route'
import { NextRequest } from 'next/server'

describe('tests /api/projects/[id]', () => {
  const projectService = new ProjectService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  describe('GET /api/projects/[id]', () => {
    it('should get a project correctly', async () => {
      const project = await projectService.createProject(projectCreateMock)
      const slug = { id: project.id }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual({ data: project })
    })

    it('should return a 404 error if the project does not exist', async () => {
      const slug = { id: 'nonexistent' }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })
})
