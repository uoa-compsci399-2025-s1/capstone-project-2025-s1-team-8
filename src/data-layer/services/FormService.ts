import type { FormQuestion } from '@/payload-types'
import type { UpdateFormQuestionData, CreateFormQuestionData } from '@/types/Collections'
import { payload } from '../adapters/Payload'

export default class FormService {
  /**
   * Creates a new formQuestion
   *
   * @param newFormQuestion The data for the new formQuestion
   * @returns The created formQuestion
   */
  public async createFormQuestion(newFormQuestion: CreateFormQuestionData): Promise<FormQuestion> {
    return await payload.create({
      collection: 'formQuestion',
      data: newFormQuestion,
    })
  }

  /**
   * Retrieves a formQuestion object by ID
   *
   * @param id The ID of the formQuestion to retrieve
   * @returns The retrieved formQuestion object
   */
  public async getFormQuestion(id: string): Promise<FormQuestion> {
    return await payload.findByID({
      collection: 'formQuestion',
      id: id,
    })
  }

  /**
   * Retrieves all formQuestions
   *
   * @returns An array of formQuestions
   */
  public async getAllFormQuestions(): Promise<FormQuestion[]> {
    const formQuestions = await payload.find({
      collection: 'formQuestion',
    })
    return formQuestions.docs
  }

  /**
   * Updates a formQuestion.
   *
   * @param id The formQuestion ID
   * @param formQuestion The updated formQuestion data object
   * @returns The updated formQuestion
   */
  public async updateformQuestion(
    id: string,
    formQuestion: UpdateFormQuestionData,
  ): Promise<FormQuestion> {
    return await payload.update({
      collection: 'formQuestion',
      id: id,
      data: formQuestion,
    })
  }

  /**
   * Deletes a formQuestion by ID
   *
   * @param id The formQuestion ID
   **/
  public async deleteFormQuestion(id: string): Promise<void> {
    await payload.delete({
      collection: 'formQuestion',
      id: id,
    })
  }
}
