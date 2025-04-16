import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { FormService } from './FormService'
import { formMock } from '@/test-config/mocks/Form.mock'

describe('Form service test', () => {
  const formService = new FormService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'form')
  })

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
