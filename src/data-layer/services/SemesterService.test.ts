import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { SemesterProjectService } from '@/data-layer/services/SemesterProjectService'
import { semesterProjectMock, semesterProjectCreateMock, semesterProjectListMock, semesterProjectMock2 } from '@/test-config/mocks/SemesterProject.mock'
import { ProjectStatus } from '@/types/Project'

describe('Semester service tests', () => {
  const semesterProjectService = new SemesterProjectService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semesterProject')
  })

  it('should create a semesterProject', async () => {
    const newSemesterProject = await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
    const res = await testPayloadObject.findByID({
      collection: 'semesterProject',
      id: newSemesterProject.id,
    })
    expect(newSemesterProject).toEqual(res)
  })

  it('should get a semesterProject by ID', async () => {
    const newSemesterProject = await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
    const res = await semesterProjectService.getSemesterProject(newSemesterProject.id)
    expect(newSemesterProject).toEqual(res)
  })

  it('should return undefined if semesterProject does not exist', async () => {
    await expect(semesterProjectService.getSemesterProject('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should update a semesterProject', async () => {
    const newSemesterProject = await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
    const updatedSemester = await semesterProjectService.updateSemesterProject(newSemesterProject.id, {
      published: true,
    })
    expect(updatedSemester.published).toEqual(true)
  })

  it('should delete a semesterProject', async () => {
    const newSemester = await semesterProjectService.createSemesterProject(semesterProjectCreateMock)
    await semesterProjectService.deleteSemesterProject(newSemester.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'semester',
        id: newSemester.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if semesterProject does not exist', async () => {
    await expect(semesterProjectService.deleteSemesterProject('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it("Should filter all semesterProjects by status", async () => {
    expect((await semesterProjectService.filterSemesterProjectsByStatus(ProjectStatus.Pending, semesterProjectListMock)).length).toEqual(2)
  })

  it("Should filter all semesterProjects by published status", async () => {
    expect((await semesterProjectService.filterSemesterProjectsByPublished(false, semesterProjectListMock)).length).toEqual(4)
})

it("Should return nothing for published projects", async () => {
  expect((await semesterProjectService.filterSemesterProjectsByPublished(true, semesterProjectListMock)).length).toEqual(0)
})

it("Should filter all semesterProjects by semester ID", async () => {
  expect((await semesterProjectService.filterProjectsBySemester("67ff38a56a35e1b6cf43a68j", semesterProjectListMock)).length).toEqual(1)
})
  it("Should return nothing for semester ID", async () => {
    expect((await semesterProjectService.filterProjectsBySemester("nonexistent_id", semesterProjectListMock)).length).toEqual(0)
  }
  )
  it("Should return all semesterProjects", async () => {
    await semesterProjectService.createSemesterProject(semesterProjectMock)
    await semesterProjectService.createSemesterProject(semesterProjectMock2)
    expect((await semesterProjectService.getAllSemesterProjects()).length).toEqual(2)
  }
  )
})
