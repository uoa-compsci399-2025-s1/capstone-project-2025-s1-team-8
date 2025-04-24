import { clientCreateMock, mockClient1 } from '@/test-config/mocks/User.mock'
import { projectMock, projectMock2, projectCreateMock } from '@/test-config/mocks/Project.mock'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import ProjectService from './ProjectService'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import UserService from './UserService'
import SemesterService from './SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { ProjectStatus } from '@/types/Project'

describe('Project service methods test', () => {
  const projectService = new ProjectService()
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'project')
  })

  it('should get all projects', async () => {
    const project1 = await projectService.createProject(projectMock)
    const project2 = await projectService.createProject(projectMock2)

    expect((await projectService.getAllProjects()).docs).toEqual(
      expect.arrayContaining([project1, project2]),
    )
  })

  it('should get all projects with pagination', async () => {
    await projectService.createProject(projectMock)
    await projectService.createProject(projectMock2)

    const page1 = await projectService.getAllProjects(1, 1)
    const page2 = await projectService.getAllProjects(2, 1)

    expect(page1.docs.length).toEqual(1)
    expect(page1.hasNextPage).toBe(true)
    expect(page2.docs.length).toEqual(2)
    expect(page2.hasNextPage).toBe(false)
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
    const project1 = await projectService.createProject(projectMock)

    await projectService.createProject(projectMock2)

    const testProject1 = await projectService.getProjectByName(project1.name)
    const testProject2 = await projectService.getProjectByName('1234567890')
    expect(testProject1).toEqual(project1)
    expect(testProject2).toBeUndefined()
  })

  it('should get projects by clientID', async () => {
    await projectService.createProject(projectMock)
    await projectService.createProject(projectMock2)

    const client1Projects = await projectService.getProjectsByClientId(mockClient1.id)
    const client2Projects = await projectService.getProjectsByClientId('1234567890')
    expect(client1Projects.docs.length).toBe(2)
    expect(client2Projects.docs.length).toBe(0)
  })

  it('should get all projects by a client with pagination', async () => {
    const userService = new UserService()
    const client1 = await userService.createUser(clientCreateMock)
    const client2 = await userService.createUser({
      ...clientCreateMock,
      email: 'john@gmail.com',
    })
    await projectService.createProject({
      ...projectMock,
      clients: [client1, client2],
      name: 'Project 1',
    })
    await projectService.createProject({
      ...projectMock2,
      clients: [client1, client2],
      name: 'Project 2',
    })
    await projectService.createProject({
      ...projectMock,
      clients: [client1],
      name: 'Project 3',
    })

    const page1 = await projectService.getProjectsByClientId(client2.id, 2, 1)
    const page2 = await projectService.getProjectsByClientId(client1.id, 2, 2)

    expect(page1.docs.length).toEqual(2)
    expect(page1.hasNextPage).toBe(false)
    expect(page2.docs.length).toEqual(1)
    expect(page2.hasNextPage).toBe(false)
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
    const project1 = await projectService.createProject(projectMock)
    const project2 = await projectService.createProject(projectMock2)

    expect((await projectService.getAllProjects()).docs.length).toBe(2)
    await projectService.deleteProject(project1.id)
    expect((await projectService.getAllProjects()).docs).toStrictEqual([project2])
  })

  it('should throw an error if deleting a non existent project', async () => {
    await expect(projectService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
  })

  describe('Semester service tests', () => {
    const semesterProjectService = new ProjectService()

    afterEach(async () => {
      await clearCollection(testPayloadObject, 'semesterProject')
    })

    it('should create a semesterProject', async () => {
      const newSemesterProject =
        await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      const res = await testPayloadObject.findByID({
        collection: 'semesterProject',
        id: newSemesterProject.id,
      })
      expect(newSemesterProject).toEqual(res)
    })

    it('should get a semesterProject by ID', async () => {
      const newSemesterProject =
        await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      const res = await semesterProjectService.getSemesterProject(newSemesterProject.id)
      expect(newSemesterProject).toEqual(res)
    })

    it('should return undefined if semesterProject does not exist', async () => {
      await expect(semesterProjectService.getSemesterProject('nonexistent_id')).rejects.toThrow(
        'Not Found',
      )
    })

    it('should update a semesterProject', async () => {
      const newSemesterProject =
        await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      const updatedSemester = await semesterProjectService.updateSemesterProject(
        newSemesterProject.id,
        {
          published: true,
        },
      )
      expect(updatedSemester.published).toEqual(true)
    })

    it('should delete a semesterProject', async () => {
      const newSemester =
        await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      await semesterProjectService.deleteSemesterProject(newSemester.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'semesterProject',
          id: newSemester.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('should throw an error if semesterProject does not exist', async () => {
      await expect(semesterProjectService.deleteSemesterProject('nonexistent_id')).rejects.toThrow(
        'Not Found',
      )
    })

    it('Should return all semesterProjects', async () => {
      await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
      const semesterProjectList = await semesterProjectService.getAllSemesterProjects()
      expect(semesterProjectList.length).toEqual(2)
    })
  })

  it('Should return all projects for a semester with pagination', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)

    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    const res = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id)
    expect(res.docs.length).toEqual(3)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1)
    expect(res2.docs.length).toEqual(2)
    expect(res2.hasNextPage).toBe(true)
    const res3 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 2)
    expect(res3.docs.length).toEqual(1)
    expect(res3.hasNextPage).toBe(false)
  })

  it('Should return nothing if no projects for a semester', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const res = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id)
    expect(res.docs.length).toEqual(0)
    expect(res.nextPage).toBeNull()
  })

  it('Should get all semesterProjects by semesterId and publish status with pagination', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester({
      ...semesterCreateMock,
      name: 'Semester 2',
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      published: true,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      published: false,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester2.id,
      published: true,
    })

    const res = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 100, 1, {
      published: true,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1, {
      published: true,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBe(null)
    const res3 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1, {
      published: false,
    })
    expect(res3.docs.length).toEqual(1)
    expect(res3.nextPage).toBe(null)
  })

  it('Should get all semesterProjects by semesterId and status with pagination', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester({
      ...semesterCreateMock,
      name: 'Semester 2',
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Accepted,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Rejected,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester2.id,
      status: ProjectStatus.Accepted,
    })

    const res = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 100, 1, {
      status: ProjectStatus.Accepted,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1, {
      status: ProjectStatus.Accepted,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBeNull()
    const res3 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1, {
      status: ProjectStatus.Rejected,
    })
    expect(res3.docs.length).toEqual(1)
    expect(res3.nextPage).toBeNull()
  })

  it('Should get all semesterProjects by semesterId and status and publish status', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester({
      ...semesterCreateMock,
      name: 'Semester 2',
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Accepted,
      published: true,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Rejected,
      published: false,
    })
    await projectService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester2.id,
      status: ProjectStatus.Accepted,
      published: true,
    })

    const res = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 100, 1, {
      published: true,
      status: ProjectStatus.Accepted,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getSemesterProjectsByPublishedAndStatus(semester1.id, 2, 1, {
      published: false,
      status: ProjectStatus.Rejected,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBeNull()
  })
})
