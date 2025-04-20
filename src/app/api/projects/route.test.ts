import { StatusCodes } from 'http-status-codes'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET } from '@/app/api/projects/route'

describe('get projects', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get no projects if none are created', async () => {
    const res = await GET()
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ data: [] })
  })

  it('should return a list of all projects created', async () => {
    const projectService = new ProjectService()
    await projectService.createProject(projectCreateMock)
    await projectService.createProject(projectCreateMock)
    const res = await GET()
    expect(res.status).toBe(StatusCodes.OK)
    const data = await res.json()
    expect(data.data.length).toEqual(2)
  })
})
