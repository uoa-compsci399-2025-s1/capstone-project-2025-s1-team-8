import { testPayloadObject } from '@/test-config/utils'
import FormService from './FormService'
import { formMock } from '@/test-config/mocks/Form.mock'
import { formQuestionCreateMock, formQuestionUpdateMock } from '@/test-config/mocks/Form.mock'

describe('Form service tests', () => {
  const formService = new FormService()

  describe('Form service test', () => {
    it('create a new form', async () => {
      const newForm = await formService.createForm(formMock)
      const fetchedForm = await testPayloadObject.findByID({
        collection: 'form',
        id: newForm.id,
      })
      expect(newForm).toEqual(fetchedForm)
    })

    it('fetches the form', async () => {
      const createdForm = await formService.createForm(formMock)
      const fetchedForm = await formService.getForm()
      expect(fetchedForm).toEqual(createdForm)
    })

    it('update a form', async () => {
      await formService.createForm(formMock)
      const updatedForm = await formService.updateForm({
        name: 'updated form',
      })
      expect(updatedForm.name).toEqual('updated form')
    })

    it('not found - update a non-existingform', async () => {
      await expect(
        formService.updateForm({
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

    it('not found - fetch a form by nonexisting ID', async () => {
      await expect(formService.getForm()).rejects.toThrow('Not Found')
    })
  })

  describe('Form question tests', () => {
    it('create a formQuestion', async () => {
      const newFormQuestion = await formService.createFormQuestion(formQuestionCreateMock)
      const res = await testPayloadObject.findByID({
        collection: 'formQuestion',
        id: newFormQuestion.id,
      })
      expect(newFormQuestion).toEqual(res)
    })

    it('find a formQuestion by ID', async () => {
      const createdFormQuestion = await formService.createFormQuestion(formQuestionCreateMock)
      const fetchedFormQuestion = await formService.getFormQuestion(createdFormQuestion.id)
      expect(fetchedFormQuestion).toEqual(createdFormQuestion)
    })

    it('not found - find formQuestion with nonexistent id', async () => {
      await expect(formService.getFormQuestion('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('update a formQuestion by ID', async () => {
      const createdUser = await formService.createFormQuestion(formQuestionCreateMock)
      const updatedFormQuestion = await formService.updateformQuestion(
        createdUser.id,
        formQuestionUpdateMock,
      )
      expect(updatedFormQuestion.question).toEqual(formQuestionUpdateMock.question)
    })

    it('not found - update a formQuestion with a nonexistant ID', async () => {
      await expect(
        formService.updateformQuestion('nonexistent_id', formQuestionUpdateMock),
      ).rejects.toThrow('Not Found')
    })

    it('delete a formQuestion by ID', async () => {
      const createdFormQuestion = await formService.createFormQuestion(formQuestionCreateMock)
      await formService.deleteFormQuestion(createdFormQuestion.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'formQuestion',
          id: createdFormQuestion.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('not found - delete a formQuestion with a nonexistent ID', async () => {
      await expect(formService.deleteFormQuestion('non existent ID')).rejects.toThrow('Not Found')
    })
  })
})
