import { mockClient1 } from '@/test-config/mocks/User.mock'
import { projectMock, projectMock2, projectCreateMock } from '@/test-config/mocks/Project.mock'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { ProjectService } from './ProjectService'

describe('Project service methods test', () => {
  const projectService = new ProjectService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get all projects', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock2,
    })

    expect(await projectService.getAllProjects()).toEqual(
      expect.arrayContaining([project1, project2]),
    )
  })

  it('should get project by ID', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    const testProject1 = await projectService.getProjectById(project1.id)
    await expect(projectService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
    expect(testProject1).toEqual(project1)
  })

  it('should get project by name', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    await testPayloadObject.create({
      collection: 'project',
      data: projectMock2,
    })

    const testProject1 = await projectService.getProjectByName(project1.name)
    const testProject2 = await projectService.getProjectByName('1234567890')
    expect(testProject1).toEqual(project1)
    expect(testProject2).toBeUndefined()
  })

  it('should get projects by clientID', async () => {
    await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    await testPayloadObject.create({
      collection: 'project',
      data: projectMock2,
    })

    const client1Projects = await projectService.getProjectsByClientId(mockClient1.id)
    const client2Projects = await projectService.getProjectsByClientId('1234567890')
    expect(client1Projects.length).toBe(2)
    expect(client2Projects.length).toBe(0)
  })

  it('should create a project', async () => {
    const project1 = await projectService.createProject(projectCreateMock)

    expect(project1).toEqual(
      await testPayloadObject.findByID({
        collection: 'project',
        id: project1.id,
      }),
    )
  })

  it('should update a project', async () => {
    const project1 = await projectService.createProject(projectCreateMock)

    const updatedProject1Data = {
      description: 'Description 1 v2',
    }

    const updatedProject1 = await projectService.updateProject(project1.id, updatedProject1Data)

    expect(updatedProject1).toEqual(
      await testPayloadObject.findByID({
        collection: 'project',
        id: updatedProject1.id,
      }),
    )
  })

  it('should delete projects', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock2,
    })

    expect((await projectService.getAllProjects()).length).toBe(2)
    await projectService.deleteProject(project1.id)
    expect(await projectService.getAllProjects()).toStrictEqual([project2])
  })

  it('should throw an error if deleting a non existent project', async () => {
    await expect(projectService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
