import { testPayloadObject } from '@/test-config/utils'
import SemesterDataService from './SemesterDataService'
import { semesterCreateMock, semesterCreateMock2 } from '@/test-config/mocks/Semester.mock'
import { SemesterType } from '@/types/Semester'

describe('Semester service tests', () => {
  const semesterDataService = new SemesterDataService()

  it('should create a semester', async () => {
    const newSemester = await semesterDataService.createSemester(semesterCreateMock)
    const fetchedSemester = await testPayloadObject.findByID({
      collection: 'semester',
      id: newSemester.id,
    })
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get a semester', async () => {
    const newSemester = await semesterDataService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterDataService.getSemester(newSemester.id)
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get all semesters', async () => {
    const semester1 = await semesterDataService.createSemester(semesterCreateMock)
    const semester2 = await semesterDataService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterDataService.getAllSemesters()
    expect(fetchedSemester.length).toEqual(2)
    expect(fetchedSemester).toEqual(expect.arrayContaining([semester1, semester2]))
  })

  it('should get all semesters with timeframe filtering', async () => {
    const pastSemester = await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date('2023-01-01').toISOString(),
      endDate: new Date('2023-06-30').toISOString(),
    })

    const today = new Date()

    const upcomingSemester = await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    const currentSemester = await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString(),
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
    })

    const past = await semesterDataService.getAllSemesters(SemesterType.Past)
    expect(past).toStrictEqual([pastSemester])

    const current = await semesterDataService.getAllSemesters(SemesterType.Current)
    expect(current).toStrictEqual([currentSemester])

    const upcoming = await semesterDataService.getAllSemesters(SemesterType.Upcoming)
    expect(upcoming).toStrictEqual([upcomingSemester])
  })

  it('should get the next upcoming semester', async () => {
    const today = new Date()

    await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
    })

    await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4).toISOString(),
    })

    // Supposedly this semester is fetched as it is the closest in start date and end date
    const nextSemester = await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
    })

    await semesterDataService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
    })

    const nextSem = await semesterDataService.getAllSemesters(SemesterType.Next)
    expect(nextSem).toStrictEqual([nextSemester])
  })

  it('should return undefined if semester does not exist', async () => {
    await expect(semesterDataService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should update a semester', async () => {
    const newSemester = await semesterDataService.createSemester(semesterCreateMock)
    const updatedSemester = await semesterDataService.updateSemester(newSemester.id, {
      name: 'Updated Semester',
    })
    expect(updatedSemester.name).toEqual('Updated Semester')
  })

  it('should delete a semester', async () => {
    const newSemester = await semesterDataService.createSemester(semesterCreateMock)
    await semesterDataService.deleteSemester(newSemester.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'semester',
        id: newSemester.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if semester does not exist', async () => {
    await expect(semesterDataService.deleteSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should return all the semester documents', async () => {
    const semester1 = await semesterDataService.createSemester(semesterCreateMock)
    const semester2 = await semesterDataService.createSemester(semesterCreateMock2)
    const fetchedUsers = await semesterDataService.getAllSemesters()

    expect(fetchedUsers).toStrictEqual(expect.arrayContaining([semester1, semester2]))
  })

  it('not found - find user with nonexistent id', async () => {
    await expect(semesterDataService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
