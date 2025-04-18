import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { FormService } from './FormService'
import { formResponseCreateMock } from '@/test-config/mocks/Form.mock'

describe('Form service tests', () => {
  const formService = new FormService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'formResponse')
  })

  describe('Form response service tests', () => {
    it('should create a form response', async () => {
      const newFormResponse = await formService.createFormResponse(formResponseCreateMock)
      const fetchedFormResponse = await testPayloadObject.findByID({
        collection: 'formResponse',
        id: newFormResponse.id,
      })
      expect(newFormResponse).toEqual(fetchedFormResponse)
    })

    it('should get a form response', async () => {
      const newFormResponse = await formService.createFormResponse(formResponseCreateMock)
      const fetchedFormResponse = await formService.getFormResponse(newFormResponse.id)
      expect(newFormResponse).toEqual(fetchedFormResponse)
    })

    it('should return undefined if form response does not exist', async () => {
      await expect(formService.getFormResponse('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('should update a form response', async () => {
      const newFormResponse = await formService.createFormResponse(formResponseCreateMock)
      const updatedFormResponse = await formService.updateFormResponse(newFormResponse.id, {
        name: 'AI boyfriend finder',
      })
      expect(updatedFormResponse.name).toEqual('AI boyfriend finder')
    })

    it('should delete a form response', async () => {
      const newFormResponse = await formService.createFormResponse(formResponseCreateMock)
      await formService.deleteFormResponse(newFormResponse.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'formResponse',
          id: newFormResponse.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('should throw an error if form response does not exist', async () => {
      await expect(formService.deleteFormResponse('nonexistent_id')).rejects.toThrow('Not Found')
    })
  })
})
