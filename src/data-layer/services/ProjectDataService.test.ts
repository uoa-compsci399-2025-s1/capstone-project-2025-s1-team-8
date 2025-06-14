import { projectMock, projectMock2, projectCreateMock } from '@/test-config/mocks/Project.mock'
import { testPayloadObject } from '@/test-config/utils'
import ProjectDataService from './ProjectDataService'
import { semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import SemesterDataService from './SemesterDataService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { ProjectStatus } from '@/types/Project'
import { adminMock, clientMock, studentMock } from '@/test-config/mocks/Auth.mock'

describe('Project service methods test', () => {
  const projectDataService = new ProjectDataService()
  const semesterDataService = new SemesterDataService()

  describe('getAllProjects', () => {
    it('should get all projects', async () => {
      const project1 = await projectDataService.createProject(projectMock)
      const project2 = await projectDataService.createProject(projectMock2)

      expect((await projectDataService.getAllProjects()).docs).toEqual(
        expect.arrayContaining([project1, project2]),
      )
    })

    it('should get all projects with pagination', async () => {
      await projectDataService.createProject(projectMock)
      await projectDataService.createProject(projectMock2)

      const page1 = await projectDataService.getAllProjects(1, 1)
      const page2 = await projectDataService.getAllProjects(2, 1)

      expect(page1.docs.length).toEqual(1)
      expect(page1.hasNextPage).toBe(true)
      expect(page2.docs.length).toEqual(2)
      expect(page2.hasNextPage).toBe(false)
    })

    it('should get all projects with target client ID covering both client and additional clients', async () => {
      await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
        additionalClients: [],
      })
      const project1 = await projectDataService.createProject(projectMock)
      const project2 = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
        additionalClients: [clientMock],
      })

      const paginatedDocs = await projectDataService.getAllProjects(undefined, undefined, {
        clientId: clientMock.id,
      })

      expect(paginatedDocs.docs.length).toBe(2)
      expect(paginatedDocs.docs).toStrictEqual(expect.arrayContaining([project1, project2]))
    })
  })

  it('should get project by ID', async () => {
    const project1 = await testPayloadObject.create({
      collection: 'project',
      data: projectMock,
    })

    const testProject1 = await projectDataService.getProjectById(project1.id)
    await expect(projectDataService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
    expect(testProject1).toEqual(project1)
  })

  it('should get project by name', async () => {
    const project1 = await projectDataService.createProject(projectMock)

    await projectDataService.createProject(projectMock2)

    const testProject1 = await projectDataService.getProjectByName(project1.name)
    const testProject2 = await projectDataService.getProjectByName('1234567890')
    expect(testProject1).toEqual(project1)
    expect(testProject2).toBeUndefined()
  })

  it('should get projects by clientID', async () => {
    const project1 = await projectDataService.createProject(projectMock)
    const project2 = await projectDataService.createProject(projectMock2)

    const clientProjects = await projectDataService.getProjectsByClientId(clientMock.id)
    expect(clientProjects.docs).toStrictEqual(expect.arrayContaining([project1, project2]))
    await expect(projectDataService.getProjectsByClientId('1234567890')).rejects.toThrow(
      'User not found',
    )
  })

  it('should get projects by additional clients', async () => {
    await projectDataService.createProject(projectMock)
    const project2 = await projectDataService.createProject({
      ...projectCreateMock,
      additionalClients: [adminMock],
    })

    const clientProjects = await projectDataService.getProjectsByClientId(adminMock.id)
    expect(clientProjects.docs).toStrictEqual([project2])
    await expect(projectDataService.getProjectsByClientId('1234567890')).rejects.toThrow(
      'User not found',
    )
  })

  it('should get all projects by a client with pagination', async () => {
    await projectDataService.createProject(projectCreateMock)
    await projectDataService.createProject(projectCreateMock)

    const page = await projectDataService.getProjectsByClientId(clientMock.id, 1, 1)
    const page2 = await projectDataService.getProjectsByClientId(clientMock.id, 1, 2)

    expect(page.docs.length).toEqual(1)
    expect(page.hasNextPage).toBeTruthy()
    expect(page2.docs.length).toEqual(1)
    expect(page2.hasNextPage).toBeFalsy()
  })

  it('should create a project', async () => {
    const project1 = await projectDataService.createProject(projectCreateMock)

    expect(project1).toEqual(
      await testPayloadObject.findByID({
        collection: 'project',
        id: project1.id,
      }),
    )
  })

  it('should update a project', async () => {
    const project1 = await projectDataService.createProject(projectCreateMock)

    const updatedProject1Data = {
      description: 'Description 1 v2',
    }

    const updatedProject1 = await projectDataService.updateProject(project1.id, updatedProject1Data)

    expect(updatedProject1).toEqual(
      await testPayloadObject.findByID({
        collection: 'project',
        id: updatedProject1.id,
      }),
    )
  })

  it('should delete projects', async () => {
    const project1 = await projectDataService.createProject(projectMock)
    const project2 = await projectDataService.createProject(projectMock2)

    expect((await projectDataService.getAllProjects()).docs.length).toBe(2)
    await projectDataService.deleteProject(project1.id)
    expect((await projectDataService.getAllProjects()).docs).toStrictEqual([project2])
  })

  it('should throw an error if deleting a non existent project', async () => {
    await expect(projectDataService.getProjectById('nonexistent_id')).rejects.toThrow('Not Found')
  })

  describe('Semester service tests', () => {
    it('should create a semesterProject', async () => {
      const newSemesterProject =
        await projectDataService.createSemesterProject(semesterProjectCreateMock)
      const res = await testPayloadObject.findByID({
        collection: 'semesterProject',
        id: newSemesterProject.id,
      })
      expect(newSemesterProject).toEqual(res)
    })

    it('should get a semesterProject by ID', async () => {
      const newSemesterProject =
        await projectDataService.createSemesterProject(semesterProjectCreateMock)
      const res = await projectDataService.getSemesterProject(newSemesterProject.id)
      expect(newSemesterProject).toEqual(res)
    })

    it('should return undefined if semesterProject does not exist', async () => {
      await expect(projectDataService.getSemesterProject('nonexistent_id')).rejects.toThrow(
        'Not Found',
      )
    })

    it('should update a semesterProject', async () => {
      const newSemesterProject =
        await projectDataService.createSemesterProject(semesterProjectCreateMock)
      const updatedSemester = await projectDataService.updateSemesterProject(
        newSemesterProject.id,
        {
          number: 200,
        },
      )
      expect(updatedSemester.number).toEqual(200)
    })

    it('should delete a semesterProject', async () => {
      const newSemester = await projectDataService.createSemesterProject(semesterProjectCreateMock)
      await projectDataService.deleteSemesterProject(newSemester.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'semesterProject',
          id: newSemester.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('should throw an error if semesterProject does not exist', async () => {
      await expect(projectDataService.deleteSemesterProject('nonexistent_id')).rejects.toThrow(
        'Not Found',
      )
    })

    it('Should return all semesterProjects', async () => {
      await projectDataService.createSemesterProject(semesterProjectCreateMock)
      await projectDataService.createSemesterProject(semesterProjectCreateMock)
      const semesterProjectList = await projectDataService.getAllSemesterProjects()
      expect(semesterProjectList.length).toEqual(2)
    })
  })

  it('Should return all projects for a semester with pagination', async () => {
    const semester1 = await semesterDataService.createSemester(semesterCreateMock)

    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
    })
    const res = await projectDataService.getAllSemesterProjectsBySemester(semester1.id)
    expect(res.docs.length).toEqual(3)
    expect(res.nextPage).toBeNull()
    const res2 = await projectDataService.getAllSemesterProjectsBySemester(semester1.id, 2, 1)
    expect(res2.docs.length).toEqual(2)
    expect(res2.hasNextPage).toBe(true)
    const res3 = await projectDataService.getAllSemesterProjectsBySemester(semester1.id, 2, 2)
    expect(res3.docs.length).toEqual(1)
    expect(res3.hasNextPage).toBe(false)
  })

  it('Should return nothing if no projects for a semester', async () => {
    const semester1 = await semesterDataService.createSemester(semesterCreateMock)
    const res = await projectDataService.getAllSemesterProjectsBySemester(semester1.id)
    expect(res.docs.length).toEqual(0)
    expect(res.nextPage).toBeNull()
  })

  it('Should get all semesterProjects by semesterId and status with pagination', async () => {
    const semester1 = await semesterDataService.createSemester(semesterCreateMock)
    const semester2 = await semesterDataService.createSemester({
      ...semesterCreateMock,
      name: 'Semester 2',
    })
    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Approved,
    })
    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester1.id,
      status: ProjectStatus.Rejected,
    })
    await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      semester: semester2.id,
      status: ProjectStatus.Approved,
    })
    const res = await projectDataService.getAllSemesterProjectsBySemester(semester1.id, 100, 1, {
      status: ProjectStatus.Approved,
    })
    expect(res.docs.length).toEqual(1)
    expect(res.nextPage).toBeNull()
    const res2 = await projectDataService.getAllSemesterProjectsBySemester(semester1.id, 2, 1, {
      status: ProjectStatus.Approved,
    })
    expect(res2.docs.length).toEqual(1)
    expect(res2.nextPage).toBeNull()
    const res3 = await projectDataService.getAllSemesterProjectsBySemester(semester1.id, 2, 1, {
      status: ProjectStatus.Rejected,
    })
    expect(res3.docs.length).toEqual(1)
    expect(res3.nextPage).toBeNull()
  })

  it('should get all semester projects by project ID', async () => {
    expect(await projectDataService.getSemesterProjectsByProject('spirit_blossom_yone')).toEqual([])

    const project = await projectDataService.createProject(projectCreateMock)
    const semesterProject = await projectDataService.createSemesterProject({
      ...semesterProjectCreateMock,
      project,
    })
    await projectDataService.createSemesterProject(semesterProjectCreateMock)
    expect(await projectDataService.getSemesterProjectsByProject(project.id)).toEqual([
      semesterProject,
    ])
  })
})
