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
    expect(fetchedSemester.length).toEqual(2)
    expect(fetchedSemester).toEqual(expect.arrayContaining([semester1, semester2]))
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

    const past = await semesterService.getAllSemesters(SemesterType.Past)
    expect(past).toStrictEqual([pastSemester])

    const current = await semesterService.getAllSemesters(SemesterType.Current)
    expect(current).toStrictEqual([currentSemester])

    const upcoming = await semesterService.getAllSemesters(SemesterType.Upcoming)
    expect(upcoming).toStrictEqual([upcomingSemester])
  })

  it('should get the next upcoming semester', async () => {
    const today = new Date()

    await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
    })

    await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4).toISOString(),
    })

    // Supposedly this semester is fetched as it is the closest in start date and end date
    const nextSemester = await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
    })

    await semesterService.createSemester({
      ...semesterCreateMock,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(),
    })

    const nextSem = await semesterService.getAllSemesters(SemesterType.Next)
    expect(nextSem).toStrictEqual([nextSemester])
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

  it('should return all the semester documents', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester(semesterCreateMock2)
    const fetchedUsers = await semesterService.getAllSemesters()

    expect(fetchedUsers).toStrictEqual(expect.arrayContaining([semester1, semester2]))
  })

  it('not found - find user with nonexistent id', async () => {
    await expect(semesterService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
