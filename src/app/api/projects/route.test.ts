import { StatusCodes } from 'http-status-codes'
import { clearCollection, createMockNextPostRequest, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { POST } from '@/app/api/projects/route'

describe('test POST /api/projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should create a project', async () => {
    const projectService = new ProjectService()
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
