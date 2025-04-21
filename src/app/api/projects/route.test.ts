import { StatusCodes } from 'http-status-codes'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, POST } from '@/app/api/projects/route'
import { createMockNextRequestWithBody, createMockNextRequest } from '@/test-config/utils'

describe('test /api/projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get no projects if none are created', async () => {
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ data: [] })
  })

  it('should return a list of all projects created', async () => {
    const projectService = new ProjectService()
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects'))
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(2)
  })

  it('should return a list of all projects created with pagination', async () => {
    const projectService = new ProjectService()
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects?page=1&limit=1'))
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(1)
  })
  it('should return a list of all projects created with pagination, page 2, and page limit 2', async () => {
    const projectService = new ProjectService()
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET(createMockNextRequest('http://localhost:3000/api/projects?page=2&limit=2'))
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(1)
  })
  it('should create a project', async () => {
    const projectService = new ProjectService()
    const req = createMockNextRequestWithBody(
      'https://localhost:3000/api/projects',
      projectCreateMock,
    )
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.CREATED)
    const project = (await res.json()).data
    expect(project).toEqual(await projectService.getProjectById(project.id))
  })

  it('should fail to create a project', async () => {
    const req = createMockNextRequestWithBody('https://localhost:3000/api/projects', {
      ...projectCreateMock,
      description: undefined,
    })
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })
})
