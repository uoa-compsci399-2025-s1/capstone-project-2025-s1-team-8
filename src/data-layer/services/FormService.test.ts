import { testPayloadObject } from '@/test-config/utils'
import FormService from './FormService'
import { formQuestionCreateMock, formQuestionUpdateMock } from '@/test-config/mocks/Form.mock'

describe('Form service tests', () => {
  const formService = new FormService()

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
