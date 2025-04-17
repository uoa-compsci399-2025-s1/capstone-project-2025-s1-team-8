import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { SemesterService } from './SemesterService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'

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
})