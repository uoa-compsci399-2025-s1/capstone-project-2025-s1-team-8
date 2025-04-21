import { StatusCodes } from 'http-status-codes'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock} from '@/test-config/mocks/Project.mock'
import { POST } from '@/app/api/projects/route'
import { NextRequest } from 'next/server'

describe('get projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should create a project', async () => {
    const projectService = new ProjectService()
    const req = new NextRequest('https://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectCreateMock),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.CREATED)
    const project = (await res.json()).data
    expect(project).toEqual(await projectService.getProjectById(project.id))
  })

  it('should fail to create a project', async () => {
    const req = new NextRequest('https://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({ ... projectCreateMock, description: undefined }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })
})
