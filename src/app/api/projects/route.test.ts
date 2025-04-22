import { StatusCodes } from 'http-status-codes'
import {
  clearCollection,
  createMockNextPostRequest,
  testPayloadObject,
  createMockNextRequest,
} from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, POST } from '@/app/api/projects/route'

describe('test /api/projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  const projectService = new ProjectService()

  it('should get no projects if none are created', async () => {
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual([])
  })

  it('should return a list of all projects created', async () => {
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(2)
  })

  it('should return bad Request if limit is more than 100 or less than 1', async () => {
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects?limit=101'))
    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    const res2 = await GET(
      createMockNextRequest('http://localhost:3000/api/projects?limit=0'))
    expect(res2.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it('should return a list of all projects created with pagination', async () => {
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

  it('should create a project', async () => {
    const req = createMockNextPostRequest('https://localhost:3000/api/projects', projectCreateMock)
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.CREATED)
    const project = (await res.json()).data
    expect(project).toEqual(await projectService.getProjectById(project.id))
  })

  it('should fail to create a project', async () => {
    const req = createMockNextPostRequest('https://localhost:3000/api/projects', {
      ...projectCreateMock,
      description: undefined,
    })
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })
})
