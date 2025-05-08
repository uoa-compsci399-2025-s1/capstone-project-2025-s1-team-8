import { projectMock, projectMock2, projectCreateMock } from '@/test-config/mocks/Project.mock'
import { testPayloadObject } from '@/test-config/utils'
import ProjectService from './ProjectService'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import SemesterService from './SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { ProjectStatus } from '@/types/Project'
import { clientMock } from '@/test-config/mocks/Auth.mock'

describe('Project service methods test', () => {
  const projectService = new ProjectService()
  const semesterService = new SemesterService()

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
    const project1 = await projectService.createProject(projectMock)
    const project2 = await projectService.createProject(projectMock2)

    const clientProjects = await projectService.getProjectsByClientId(clientMock.id)
    console.log(clientProjects)
    expect(clientProjects.docs).toStrictEqual(expect.arrayContaining([project1, project2]))
    await expect(projectService.getProjectsByClientId('1234567890')).rejects.toThrow(
      'User not found',
    )
  })

  it('should get all projects by a client with pagination', async () => {
    await projectService.createProject({
      ...projectCreateMock,
      clients: [clientMock],
      name: 'Project 1',
    })
    await projectService.createProject({
      ...projectCreateMock,
      clients: [clientMock],
      name: 'Project 2',
    })

    const page = await projectService.getProjectsByClientId(clientMock.id, 1, 1)
    const page2 = await projectService.getProjectsByClientId(clientMock.id, 1, 2)

    expect(page.docs.length).toEqual(1)
    expect(page.hasNextPage).toBeTruthy()
    expect(page2.docs.length).toEqual(1)
    expect(page2.hasNextPage).toBeFalsy()
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
    it('should create a semesterProject', async () => {
      const newSemesterProject =
        await projectService.createSemesterProject(semesterProjectCreateMock)
      const res = await testPayloadObject.findByID({
        collection: 'semesterProject',
        id: newSemesterProject.id,
      })
      expect(newSemesterProject).toEqual(res)
    })

    it('should get a semesterProject by ID', async () => {
      const newSemesterProject =
        await projectService.createSemesterProject(semesterProjectCreateMock)
      const res = await projectService.getSemesterProject(newSemesterProject.id)
      expect(newSemesterProject).toEqual(res)
    })

    it('should return undefined if semesterProject does not exist', async () => {
      await expect(projectService.getSemesterProject('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('should update a semesterProject', async () => {
      const newSemesterProject =
        await projectService.createSemesterProject(semesterProjectCreateMock)
      const updatedSemester = await projectService.updateSemesterProject(newSemesterProject.id, {
        published: true,
      })
      expect(updatedSemester.published).toEqual(true)
    })

    it('should delete a semesterProject', async () => {
      const newSemester = await projectService.createSemesterProject(semesterProjectCreateMock)
      await projectService.deleteSemesterProject(newSemester.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'semesterProject',
          id: newSemester.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('should throw an error if semesterProject does not exist', async () => {
      await expect(projectService.deleteSemesterProject('nonexistent_id')).rejects.toThrow(
        'Not Found',
      )
    })

    it('Should return all semesterProjects', async () => {
      await projectService.createSemesterProject(semesterProjectCreateMock)
      await projectService.createSemesterProject(semesterProjectCreateMock)
      const semesterProjectList = await projectService.getAllSemesterProjects()
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
    const res = await projectService.getAllProjectsBySemester(semester1.id)
    expect(res.docs.length).toEqual(3)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1)
    expect(res2.docs.length).toEqual(2)
    expect(res2.hasNextPage).toBe(true)
    const res3 = await projectService.getAllProjectsBySemester(semester1.id, 2, 2)
    expect(res3.docs.length).toEqual(1)
    expect(res3.hasNextPage).toBe(false)
  })

  it('Should return nothing if no projects for a semester', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const res = await projectService.getAllProjectsBySemester(semester1.id)
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

    const res = await projectService.getAllProjectsBySemester(semester1.id, 100, 1, {
      published: true,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1, {
      published: true,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBe(null)
    const res3 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1, {
      published: false,
    })
    expect(res3.docs.length).toEqual(2)
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

    const res = await projectService.getAllProjectsBySemester(semester1.id, 100, 1, {
      status: ProjectStatus.Accepted,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1, {
      status: ProjectStatus.Accepted,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBeNull()
    const res3 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1, {
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

    const res = await projectService.getAllProjectsBySemester(semester1.id, 100, 1, {
      published: true,
      status: ProjectStatus.Accepted,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectService.getAllProjectsBySemester(semester1.id, 2, 1, {
      published: false,
      status: ProjectStatus.Rejected,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBeNull()
  })
})
