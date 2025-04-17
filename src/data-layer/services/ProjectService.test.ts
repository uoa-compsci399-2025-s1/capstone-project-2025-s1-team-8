import { expect, test, describe, afterEach } from 'vitest'
import { mockClient1, mockClient2 } from '@/test-config/mocks/User.mock'
import {
  mockProject1,
  mockProject2,
  mockCreateProject1,
  mockCreateProject2,
} from '@/test-config/mocks/Project.mock'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { ProjectService } from './ProjectService'

describe('Testing all the project service methods', () => {
  const projectService = new ProjectService()
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })
  test('Check get all projects service method', async () => {
    expect((await projectService.getAllProjects()).length).toBe(0)
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    expect((await projectService.getAllProjects()).length).toBe(1)
    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    expect((await projectService.getAllProjects()).length).toBe(2)
  })

  test('Get project by ID', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const testProject1 = await projectService.getProjectById(project1.id)
    await expect(projectService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
    expect(testProject1).toEqual(project1)
  })

  test('Get project by name', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    const testProject1 = await projectService.getProjectByName(project1.name)
    const testProject2 = await projectService.getProjectByName('1234567890')
    expect(testProject1).toEqual(project1)
    expect(testProject2).toBeUndefined()
  })

  test('Get projects by clientID', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    const client1Projects = await projectService.getProjectsByClientId(mockClient1.id)
    const client2Projects = await projectService.getProjectsByClientId('1234567890')
    expect(client1Projects.length).toBe(2)
    expect(client2Projects.length).toBe(0)
  })
  test('Create project', async () => {
    const project1 = await projectService.createProject(mockCreateProject1)

    expect(project1).toEqual(
      await testPayloadObject.findByID({
        collection: 'project',
        id: project1.id,
      }),
    )
  })

  test('Update', async () => {
    const project1 = await projectService.createProject(mockCreateProject1)

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

  test('Check delete projects method', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2 = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    expect((await projectService.getAllProjects()).length).toBe(2)
    await projectService.deleteProject(project1.id)
    expect((await projectService.getAllProjects()).length).toBe(1)
    await expect(projectService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
    expect((await projectService.getAllProjects()).length).toBe(1)
  })
})
