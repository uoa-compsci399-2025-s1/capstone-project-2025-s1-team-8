import { StatusCodes } from 'http-status-codes'
import {
  clearCollection,
  createMockNextPatchRequest,
  paramsToPromise,
  testPayloadObject,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, DELETE, PATCH } from '@/app/api/projects/[projectId]/route'
import { NextRequest } from 'next/server'

describe('tests GET /api/project/[id]', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })
  const projectService = new ProjectService()

  it('should get a project correctly', async () => {
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
    const project = await projectService.createProject(projectCreateMock)
    const slug = { projectId: project.id }
    const res = await DELETE({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NO_CONTENT)
    expect((await projectService.getAllProjects()).docs.length).toEqual(0)
  })

  it('should return a 404 error if the project does not exist', async () => {
    const slug = { projectId: 'nonexistent' }
    const res = await DELETE({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect(await res.json()).toEqual({ error: 'Project not found' })
  })

  it('should update a project correctly', async () => {
    const project = await projectService.createProject(projectCreateMock)
    const slug = { projectId: project.id }
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
    const slug = { projectId: 'nonexistent' }
    const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.NOT_FOUND)
    expect(await res.json()).toEqual({ error: 'Project not found' })
  })
})
