import { clearCollection, testPayloadObject } from '@/test-config/utils'
import SemesterService from './SemesterService'
import { semesterCreateMock, semesterCreateMock2 } from '@/test-config/mocks/Semester.mock'

describe('Semester service tests', () => {
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semester')
  })

  it('should create a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await testPayloadObject.findByID({
      collection: 'semester',
      id: newSemester.id,
    })
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterService.getSemester(newSemester.id)
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get all semesters', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterService.getAllSemesters()
    expect(fetchedSemester.docs.length).toEqual(2)
    expect(fetchedSemester.docs).toEqual(expect.arrayContaining([semester1, semester2]))
  })

  it('should return undefined if semester does not exist', async () => {
    await expect(semesterService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should update a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const updatedSemester = await semesterService.updateSemester(newSemester.id, {
      name: 'Updated Semester',
    })
    expect(updatedSemester.name).toEqual('Updated Semester')
  })

  it('should delete a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    await semesterService.deleteSemester(newSemester.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'semester',
        id: newSemester.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if semester does not exist', async () => {
    await expect(semesterService.deleteSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should return a paginated list of semesters', async () => {
    await semesterService.createSemester(semesterCreateMock)
    await semesterService.createSemester(semesterCreateMock2)
    const fetchedUsers = await semesterService.getAllSemesters(1)

    expect(fetchedUsers.docs.length).toEqual(1)
    expect(fetchedUsers.hasNextPage).toBeTruthy()

    const nextPage = await semesterService.getAllSemesters(
      1,
      fetchedUsers.nextPage ? fetchedUsers.nextPage : undefined,
    )
    expect(nextPage.docs.length).toEqual(1)
    expect(nextPage.hasNextPage).toBeFalsy()

    expect(nextPage.docs[0].id).not.toEqual(fetchedUsers.docs[0].id)
  })

  it('not found - find user with nonexistent id', async () => {
    await expect(semesterService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
