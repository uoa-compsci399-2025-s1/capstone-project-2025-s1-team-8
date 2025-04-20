import { StatusCodes } from 'http-status-codes'
import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, DELETE } from '@/app/api/projects/[projectId]/route'
import { NextRequest } from 'next/server'

describe('get projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get a project correctly', async () => {
    const projectService = new ProjectService()
    const project = await projectService.createProject(projectCreateMock)
    const slug = { projectId: project.id }
    const res = await GET({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ data: project })
  })

  it('should return a 404 error if the project does not exist', async () => {
    const slug = { projectId: 'nonexistent' }
    const res = await GET({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect(await res.json()).toEqual({ error: 'Project not found' })
  })

  it('should delete a project correctly', async () => {
    const projectService = new ProjectService()
    const project = await projectService.createProject(projectCreateMock)
    const slug = { projectId: project.id }
    const res = await DELETE({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NO_CONTENT)
    expect((await projectService.getAllProjects()).length).toEqual(0)
  })
  
  it('should return a 404 error if the project does not exist', async () => {
    const slug = { projectId: 'nonexistent' }
    const res = await DELETE({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect(await res.json()).toEqual({ error: 'Project not found' })
  })
})
