import { expect, test, describe, afterEach } from 'vitest'
import { User } from '@/payload-types'
import { UserRole } from '@/types/user'
import { mockClient1, mockClient2 } from '@/test-config/mocks/User.mock'
import {
  mockProject1,
  mockProject2,
  mockProject3,
  mockProject4,
} from '@/test-config/mocks/Project.mock'
import { clearCollection, testPayloadObject } from '@/test-config/utils'

import { Project } from '@/payload-types'
import { ProjectService } from './ProjectService'
import { mock } from 'node:test'

describe('Testing all the project service methods', () => {
  const projectService = new ProjectService()
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
    await clearCollection(testPayloadObject, 'user')
  })
  test('Check get all projects service method', async () => {
    let projects: Array<Project> = await projectService.getAllProjects()
    expect(projects.length).toBe(0)
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    projects = await projectService.getAllProjects()

    expect(projects.length).toBe(1)
    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    projects = await projectService.getAllProjects()
    expect(projects.length).toBe(2)
  })

  test('Get project by ID', async () => {
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    const testProject1: Project | null = await projectService.getProjectById(project1.id)
    const testProject2: Project | null = await projectService.getProjectById(project2.id)
    const testProject3: Project | null = await projectService.getProjectById('1234567890')
    expect(testProject1).not.toBeNull()
    expect(testProject1).toEqual(project1)
    expect(testProject1?.name).toBe(project1.name)
    expect(testProject1?.description).toBe(project1.description)
    expect(testProject1?.clients.length).toBe(1)
    expect(testProject2).not.toBeNull()
    expect(testProject2).toEqual(project2)
    expect(testProject2?.name).toBe(project2.name)
    expect(testProject2?.description).toBe(project2.description)
    expect(testProject2?.clients.length).toBe(2)
    expect(testProject3).toBeNull()
  })

  test('Get project by name', async () => {
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    const testProject1: Project | null = await projectService.getProjectByName(project1.name)
    const testProject2: Project | null = await projectService.getProjectByName(project2.name)
    const testProject3: Project | null = await projectService.getProjectByName('1234567890')
    expect(testProject1).not.toBeNull()
    expect(testProject1).toEqual(project1)
    expect(testProject1?.name).toBe(project1.name)
    expect(testProject1?.description).toBe(project1.description)
    expect(testProject1?.clients.length).toBe(1)
    expect(testProject2).not.toBeNull()
    expect(testProject2).toEqual(project2)
    expect(testProject2?.name).toBe(project2.name)
    expect(testProject2?.description).toBe(project2.description)
    expect(testProject2?.clients.length).toBe(2)
    expect(testProject3).toBeNull()
  })

  test('Get projects by clientID', async () => {
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject2,
    })

    const client1Projects = await projectService.getProjectsByClientId(mockClient1.id)
    const client2Projects = await projectService.getProjectsByClientId(mockClient2.id)
    const client3Projects = await projectService.getProjectsByClientId('1234567890')
    expect(client1Projects.length).toBe(2)
    expect(client2Projects.length).toBe(1)
    expect(client3Projects.length).toBe(0)
    expect(client3Projects).toEqual([])
  })
  test('Create project', async () => {
    const project1: Project = await projectService.createProject(mockProject3)
    const project2: Project = await projectService.createProject(mockProject4)

    expect(project1).not.toBeNull()
    expect(project1.name).toBe(mockProject3.name)
    expect(project1.description).toBe(mockProject3.description)
    expect(project1.clients.length).toBe(1)
    expect(project2).not.toBeNull()
    expect(project2.name).toBe(mockProject4.name)
    expect(project2.description).toBe(mockProject4.description)
    expect(project2.clients.length).toBe(2)
  })

  test('Update', async () => {
    const project1: Project = await projectService.createProject(mockProject3)
    const project2: Project = await projectService.createProject(mockProject4)

    const updatedProject1Data = {
      name: 'Project 1',
      description: 'Description 1 v2',
      clients: [mockClient1],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const updatedProject2Data = {
      name: 'Project 2',
      description: 'Description 2 v2',
      clients: [mockClient1, mockClient2],
      timestamp: '2023-12-01T00:00:00Z',
    }

    const updatedProject1 = await projectService.updateProject(project1.id, updatedProject1Data)

    const updatedProject2 = await projectService.updateProject(project2.id, updatedProject2Data)

    expect(updatedProject1).not.toBeNull()
    expect(updatedProject1?.name).toBe(updatedProject1Data.name)
    expect(updatedProject1?.description).toBe(updatedProject1Data.description)
    expect(updatedProject1?.clients.length).toBe(1)
    expect(updatedProject2).not.toBeNull()
    expect(updatedProject2?.name).toBe(updatedProject2Data.name)
    expect(updatedProject2?.description).toBe(updatedProject2Data.description)
    expect(updatedProject2?.clients.length).toBe(2)
  })

  test('Patch projects', async () => {
    const project1: Project = await projectService.createProject(mockProject3)
    const project2: Project = await projectService.createProject(mockProject4)

    const updatedProject1Data = {
      description: 'Description 1 v2',
    }

    const updatedProject2Data = {
      description: 'Description 2 v2',
    }

    const updatedProject1 = await projectService.patchProject(project1.id, updatedProject1Data)

    const updatedProject2 = await projectService.patchProject(project2.id, updatedProject2Data)

    expect(updatedProject1).not.toBeNull()
    expect(updatedProject1?.name).toBe(project1.name)
    expect(updatedProject1?.description).toBe(updatedProject1Data.description)
    expect(updatedProject1?.clients.length).toBe(1)
    expect(updatedProject2).not.toBeNull()
    expect(updatedProject2?.name).toBe(project2.name)
    expect(updatedProject2?.description).toBe(updatedProject2Data.description)
    expect(updatedProject2?.clients.length).toBe(2)
  })

  test('Check delete projects method', async () => {
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: mockProject1,
    })

    let projects: Array<Project> = await projectService.getAllProjects()
    expect(projects.length).toBe(2)
    await projectService.deleteProject(project1.id)
    projects = await projectService.getAllProjects()
    expect(projects.length).toBe(1)
    const deletedProject = await projectService.deleteProject('1234567890')
    expect(deletedProject).toBeNull()
    projects = await projectService.getAllProjects()
    expect(projects.length).toBe(1)
    await projectService.deleteProject(project2.id)
    projects = await projectService.getAllProjects()
    expect(projects.length).toBe(0)
  })
})
