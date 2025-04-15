import { expect, test, describe, afterEach } from 'vitest'
import { User } from '@/payload-types'
import { Role } from '@/types/RoleTypes'
import { clearCollection, testPayloadObject } from 'tests/utils'
import { getAllProjects } from './ProjectServices'
import { Project } from '@/payload-types'

describe('Testing all the project service methods', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
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
    const project1: Project = await testPayloadObject.create({
      collection: 'project',
      data: project1Data,
    })
    let projects: Array<Project> = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(1)
    const project2: Project = await testPayloadObject.create({
      collection: 'project',
      data: project2Data,
    })
    projects = await getAllProjects(testPayloadObject)
    expect(projects.length).toBe(2)
  })
})
