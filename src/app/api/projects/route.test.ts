import { StatusCodes } from 'http-status-codes'
import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/projects/route'
import { NextRequest } from 'next/server'
import { GetAllProjectsResponse } from '@/types/response-models/ProjectResponses'

describe('get projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get no projects if none are created', async () => {
    const res = await GET({} as NextRequest)
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({data: []})
  })

  it('should return a list of all projects created', async () => {
    const projectService = new ProjectService()
    const project1 = await projectService.createProject(projectCreateMock)
    const project2 = await projectService.createProject(projectCreateMock)
    const res = await GET({} as NextRequest)
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual<GetAllProjectsResponse>(2)
  })
})
