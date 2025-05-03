import { testPayloadObject } from '@/test-config/utils'
import SemesterService from './SemesterService'
import { semesterCreateMock, semesterCreateMock2 } from '@/test-config/mocks/Semester.mock'
import { SemesterType } from '@/types/Semester'

describe('Semester service tests', () => {
  const semesterService = new SemesterService()

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

  it('should get all semesters with timeframe filtering', async () => {
    const pastSemester = await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date('2023-01-01').toISOString(),
      endDate: new Date('2023-06-30').toISOString(),
    })

    const today = new Date()

    const upcomingSemester = await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    const currentSemester = await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    const past = await semesterService.getAllSemesters(100, 1, SemesterType.Past)
    expect(past.docs).toStrictEqual([pastSemester])

    const current = await semesterService.getAllSemesters(100, 1, SemesterType.Current)
    expect(current.docs).toStrictEqual([currentSemester])

    const upcoming = await semesterService.getAllSemesters(100, 1, SemesterType.Upcoming)
    expect(upcoming.docs).toStrictEqual([upcomingSemester])
  })

  it('should get the next upcoming semester', async () => {
    const today = new Date()

    const upcomingSemester = await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()+1).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth() + 7, today.getDate()).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    const past = await semesterService.getAllSemesters(100, 1, SemesterType.NextSemester)
    expect(past.docs).toStrictEqual([upcomingSemester])
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
