import { expect, test, describe, afterEach } from 'vitest'
import { User } from '@/payload-types'
import { Role } from '@/types/RoleTypes'
import { clearCollection, testPayloadObject } from 'tests/utils'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectByName,
  getProjectsByClientId,
  patchProject,
  updateProject,
} from './ProjectServices'
import { Project } from '@/payload-types'
import { beforeEach } from 'node:test'
import { clear } from 'console'

describe('Testing all the project service methods', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
    await clearCollection(testPayloadObject, 'user')
  })
  test('Check get all projects service method', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    let projects: Array<Project> = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(0)
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })

    projects = await getAllProjects(testPayloadObject)

    expect(projects.length).toBe(1)
    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })

    projects = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(2)
  })

  test('Get project by ID', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })

    const testProject1: Project | null = await getProjectById(testPayloadObject, project1.id)
    const testProject2: Project | null = await getProjectById(testPayloadObject, project2.id)
    const testProject3: Project | null = await getProjectById(testPayloadObject, '1234567890')
    expect(testProject1).not.toBeNull()
    expect(testProject1?.name).toBe(project1.name)
    expect(testProject1?.description).toBe(project1.description)
    expect(testProject1?.clients.length).toBe(1)
    expect(testProject2).not.toBeNull()
    expect(testProject2?.name).toBe(project2.name)
    expect(testProject2?.description).toBe(project2.description)
    expect(testProject2?.clients.length).toBe(2)
    expect(testProject3).toBeNull()
  })

  test('Get project by name', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })

    const testProject1: Project | null = await getProjectByName(testPayloadObject, project1.name)
    const testProject2: Project | null = await getProjectByName(testPayloadObject, project2.name)
    const testProject3: Project | null = await getProjectByName(testPayloadObject, '1234567890')
    expect(testProject1).not.toBeNull()
    expect(testProject1?.name).toBe(project1.name)
    expect(testProject1?.description).toBe(project1.description)
    expect(testProject1?.clients.length).toBe(1)
    expect(testProject2).not.toBeNull()
    expect(testProject2?.name).toBe(project2.name)
    expect(testProject2?.description).toBe(project2.description)
    expect(testProject2?.clients.length).toBe(2)
    expect(testProject3).toBeNull()
  })

  test('Get projects by clientID', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })

    const client1Projects = await getProjectsByClientId(testPayloadObject, user1.id)
    const client2Projects = await getProjectsByClientId(testPayloadObject, user2.id)
    const client3Projects = await getProjectsByClientId(testPayloadObject, '1234567890')
    expect(client1Projects.length).toBe(2)
    expect(client2Projects.length).toBe(1)
    expect(client3Projects.length).toBe(0)
    expect(client3Projects).toEqual([])
  })
  test('Create project', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await createProject(testPayloadObject, project1Data)
    const project2: Project = await createProject(testPayloadObject, project2Data)

    expect(project1).not.toBeNull()
    expect(project1.name).toBe(project1Data.name)
    expect(project1.description).toBe(project1Data.description)
    expect(project1.clients.length).toBe(1)
    expect(project2).not.toBeNull()
    expect(project2.name).toBe(project2Data.name)
    expect(project2.description).toBe(project2Data.description)
    expect(project2.clients.length).toBe(2)
  })

  test('Update', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await createProject(testPayloadObject, project1Data)
    const project2: Project = await createProject(testPayloadObject, project2Data)

    const updatedProject1Data = {
      name: 'Project 1',
      description: 'Description 1 v2',
      clients: [user1],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const updatedProject2Data = {
      name: 'Project 2',
      description: 'Description 2 v2',
      clients: [user1, user2],
      timestamp: '2023-12-01T00:00:00Z',
    }

    const updatedProject1 = await updateProject(testPayloadObject, project1.id, updatedProject1Data)

    const updatedProject2 = await updateProject(testPayloadObject, project2.id, updatedProject2Data)

    expect(updatedProject1).not.toBeNull()
    expect(updatedProject1?.name).toBe(updatedProject1Data.name)
    expect(updatedProject1?.description).toBe(updatedProject1Data.description)
    expect(updatedProject1?.clients.length).toBe(1)
    expect(updatedProject2).not.toBeNull()
    expect(updatedProject2?.name).toBe(updatedProject2Data.name)
    expect(updatedProject2?.description).toBe(updatedProject2Data.description)
    expect(updatedProject2?.clients.length).toBe(2)
  })

  test('Create project', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await createProject(testPayloadObject, project1Data)
    const project2: Project = await createProject(testPayloadObject, project2Data)

    expect(project1).not.toBeNull()
    expect(project1.name).toBe(project1Data.name)
    expect(project1.description).toBe(project1Data.description)
    expect(project1.clients.length).toBe(1)
    expect(project2).not.toBeNull()
    expect(project2.name).toBe(project2Data.name)
    expect(project2.description).toBe(project2Data.description)
    expect(project2.clients.length).toBe(2)
  })

  test('Patch projects', async () => {
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await createProject(testPayloadObject, project1Data)
    const project2: Project = await createProject(testPayloadObject, project2Data)

    const updatedProject1Data = {
      description: 'Description 1 v2',
    }

    const updatedProject2Data = {
      description: 'Description 2 v2',
    }

    const updatedProject1 = await patchProject(testPayloadObject, project1.id, updatedProject1Data)

    const updatedProject2 = await patchProject(testPayloadObject, project2.id, updatedProject2Data)

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
    const userData = {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'abcdefg',
    }

    const user2Data = {
      role: Role.Client,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bobdoe@gmail.com',
      password: 'abcdefg',
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })

    const user2: User = await testPayloadObject.create({
      collection: 'user',
      data: user2Data,
    })

    const project1Data = {
      name: 'Project 1',
      description: 'Description 1',
      clients: [user1],
      timestamp: '2023-10-01T00:00:00Z',
    }

    const project2Data = {
      name: 'Project 2',
      description: 'Description 2',
      clients: [user1, user2],
      timestamp: '2023-11-01T00:00:00Z',
    }

    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })

    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })

    let projects: Array<Project> = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(2)
    await deleteProject(testPayloadObject, project1.id)
    projects = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(1)
    await deleteProject(testPayloadObject, project2.id)
    projects = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(0)
  })
})
