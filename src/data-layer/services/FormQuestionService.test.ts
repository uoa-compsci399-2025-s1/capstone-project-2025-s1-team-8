import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { FormQuestionService } from './FormQuestionService'
import {
  formQuestionCreateMock,
  formQuestionUpdateMock,
} from '@/test-config/mocks/FormQuestion.mock'

describe('Form service test', () => {
  const formQuestionService = new FormQuestionService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'formQuestion')
  })

  it('create a formQuestion', async () => {
    const newFormQuestion = await formQuestionService.createFormQuestion(formQuestionCreateMock)
    const res = await testPayloadObject.findByID({
      collection: 'formQuestion',
      id: newFormQuestion.id,
    })
    expect(newFormQuestion).toEqual(res)
  })

  it('find a formQuestion by ID', async () => {
    const createdFormQuestion = await formQuestionService.createFormQuestion(formQuestionCreateMock)
    const fetchedFormQuestion = await formQuestionService.getFormQuestion(createdFormQuestion.id)
    expect(fetchedFormQuestion).toEqual(createdFormQuestion)
  })

  it('not found - find formQuestion with nonexistent id', async () => {
    await expect(formQuestionService.getFormQuestion('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('update a formQuestion by ID', async () => {
    const createdUser = await formQuestionService.createFormQuestion(formQuestionCreateMock)
    const updatedFormQuestion = await formQuestionService.updateformQuestion(
      createdUser.id,
      formQuestionUpdateMock,
    )
    expect(updatedFormQuestion.question).toEqual(formQuestionUpdateMock.question)
  })

  it('not found - update a formQuestion with a nonexistant ID', async () => {
    await expect(
      formQuestionService.updateformQuestion('nonexistent_id', formQuestionUpdateMock),
    ).rejects.toThrow('Not Found')
  })

  it('delete a formQuestion by ID', async () => {
    const createdFormQuestion = await formQuestionService.createFormQuestion(formQuestionCreateMock)
    const deletedFormQuestion = await formQuestionService.deleteFormQuestion(createdFormQuestion.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'formQuestion',
        id: createdFormQuestion.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('not found - delete a formQuestion with a nonexistent ID', async () => {
    await expect(formQuestionService.deleteFormQuestion('non existent ID')).rejects.toThrow(
      'Not Found',
    )
  })
})
