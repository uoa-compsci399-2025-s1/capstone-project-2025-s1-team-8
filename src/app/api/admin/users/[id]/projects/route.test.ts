import { StatusCodes } from 'http-status-codes'
import {
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/admin/users/[id]/projects/route'
import { mockClient1 } from '@/test-config/mocks/User.mock'

describe('test /api/admin/users/[id]/projects', () => {
  const projectService = new ProjectService()

  it('should get no projects if none are created', async () => {
    const res = await GET(createMockNextRequest('api/admin/users/123/projects'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual([])
  })

  it('should return a list of all projects for a user', async () => {
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest(`api/admin/users/${mockClient1.id}/projects`), {
      params: paramsToPromise({ id: mockClient1.id }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(2)
  })

  it('Should return a list of no projects for a user who has no projects', async () => {
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest('api/admin/users/123/projects'), {
      params: paramsToPromise({ id: '123' }),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual([])
  })

  it('should return bad Request if limit is more than 100 or less than 1', async () => {
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
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res1 = await GET(
      createMockNextRequest(`api/admin/users/${mockClient1.id}/projects?page=2&limit=2`),
      { params: paramsToPromise({ id: mockClient1.id }) },
    )
    expect(res1.status).toBe(StatusCodes.OK)
    const data1 = await res1.json()
    expect(data1.data.length).toEqual(1)
    expect(data1.nextPage).toBeNull()

    const res = await GET(
      createMockNextRequest(`api/admin/users/${mockClient1.id}/projects?page=1&limit=1`),
      { params: paramsToPromise({ id: mockClient1.id }) },
    )
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(1)
    expect(data.nextPage).not.toBeNull()
  })
})
