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
})
