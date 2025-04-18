import { describe, it, expect, afterEach } from 'vitest'

import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { FormService } from './FormService'
import { formResponseCreateMock } from '@/test-config/mocks/Form.mock'
import { formMock } from '@/test-config/mocks/Form.mock'

describe('Form service tests', () => {
  const formService = new FormService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'form')
    await clearCollection(testPayloadObject, 'formResponse')
  })

  describe('Form service test', () => {
    it('create a new form', async () => {
      const newForm = await formService.createForm(formMock)
      const fetchedForm = await testPayloadObject.findByID({
        collection: 'form',
        id: newForm.id,
      })
      expect(newForm).toEqual(fetchedForm)
    })

    it('find a form by ID', async () => {
      const createdForm = await formService.createForm(formMock)
      const fetchedForm = await formService.getForm(createdForm.id)
      expect(fetchedForm).toEqual(createdForm)
    })

    it('not found - find form with nonexistent id', async () => {
      await expect(formService.getForm('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('update a form by ID', async () => {
      const createdForm = await formService.createForm(formMock)
      const updatedForm = await formService.updateForm(createdForm.id, {
        name: 'updated form',
      })
      expect(updatedForm.name).toEqual('updated form')
    })

    it('not found - update a form by nonexisting ID', async () => {
      await expect(
        formService.updateForm('non-existing-id', {
          name: 'updated form',
        }),
      ).rejects.toThrow('Not Found')
    })

    it('delete a form by ID', async () => {
      const createdForm = await formService.createForm(formMock)
      await formService.deleteForm(createdForm.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'form',
          id: createdForm.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('not found - delete a form by nonexisting ID', async () => {
      await expect(formService.deleteForm('non-existing-id')).rejects.toThrow('Not Found')
    })
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
