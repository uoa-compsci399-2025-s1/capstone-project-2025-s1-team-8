import { testPayloadObject } from '@/test-config/utils'
import FormDataService from './FormDataService'
import { formMock } from '@/test-config/mocks/Form.mock'
import { formQuestionCreateMock, formQuestionUpdateMock } from '@/test-config/mocks/Form.mock'

describe('Form data service tests', () => {
  const formDataService = new FormDataService()

  describe('Form data service test', () => {
    it('create a new form', async () => {
      const newForm = await formDataService.createForm(formMock)
      const fetchedForm = await testPayloadObject.findByID({
        collection: 'form',
        id: newForm.id,
      })
      expect(newForm).toEqual(fetchedForm)
    })

    it('fetches the form', async () => {
      const createdForm = await formDataService.createForm(formMock)
      const fetchedForm = await formDataService.getForm()
      expect(fetchedForm).toEqual(createdForm)
    })

    it('update a form', async () => {
      await formDataService.createForm(formMock)
      const updatedForm = await formDataService.updateForm({
        name: 'updated form',
      })
      expect(updatedForm.name).toEqual('updated form')
    })

    it('not found - update a non-existingform', async () => {
      await expect(
        formDataService.updateForm({
          name: 'updated form',
        }),
      ).rejects.toThrow('Not Found')
    })

    it('delete a form by ID', async () => {
      const createdForm = await formDataService.createForm(formMock)
      await formDataService.deleteForm(createdForm.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'form',
          id: createdForm.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('not found - delete a form by nonexisting ID', async () => {
      await expect(formDataService.deleteForm('non-existing-id')).rejects.toThrow('Not Found')
    })

    it('not found - fetch a form by nonexisting ID', async () => {
      await expect(formDataService.getForm()).rejects.toThrow('Not Found')
    })
  })

  describe('Form question tests', () => {
    it('create a formQuestion', async () => {
      const newFormQuestion = await formDataService.createFormQuestion(formQuestionCreateMock)
      const res = await testPayloadObject.findByID({
        collection: 'formQuestion',
        id: newFormQuestion.id,
      })
      expect(newFormQuestion).toEqual(res)
    })

    it('find a formQuestion by ID', async () => {
      const createdFormQuestion = await formDataService.createFormQuestion(formQuestionCreateMock)
      const fetchedFormQuestion = await formDataService.getFormQuestion(createdFormQuestion.id)
      expect(fetchedFormQuestion).toEqual(createdFormQuestion)
    })

    it('not found - find formQuestion with nonexistent id', async () => {
      await expect(formDataService.getFormQuestion('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('update a formQuestion by ID', async () => {
      const createdUser = await formDataService.createFormQuestion(formQuestionCreateMock)
      const updatedFormQuestion = await formDataService.updateformQuestion(
        createdUser.id,
        formQuestionUpdateMock,
      )
      expect(updatedFormQuestion.question).toEqual(formQuestionUpdateMock.question)
    })

    it('not found - update a formQuestion with a nonexistant ID', async () => {
      await expect(
        formDataService.updateformQuestion('nonexistent_id', formQuestionUpdateMock),
      ).rejects.toThrow('Not Found')
    })

    it('delete a formQuestion by ID', async () => {
      const createdFormQuestion = await formDataService.createFormQuestion(formQuestionCreateMock)
      await formDataService.deleteFormQuestion(createdFormQuestion.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'formQuestion',
          id: createdFormQuestion.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('not found - delete a formQuestion with a nonexistent ID', async () => {
      await expect(formDataService.deleteFormQuestion('non existent ID')).rejects.toThrow(
        'Not Found',
      )
    })
  })
})
