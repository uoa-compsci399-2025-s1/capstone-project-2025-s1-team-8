import { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { FormQuestion } from '@/payload-types'

export class FormQuestionService {
  /**
   * Creates a new formQuestion
   *
   * @param newFormQuestion The data for the new formQuestion
   * @returns The created formQuestion
   */
  public async createFormQuestion(newFormQuestion: CreateFormQuestionData): Promise<FormQuestion> {
    const formQuestion = await payload.create({
      collection: 'formQuestion',
      data: newFormQuestion,
    })
    return formQuestion
  }
  /**
   * Retrieves a formQuestion object by ID
   *
   * @param id The ID of the formQuestion to retrieve
   * @returns The retrieved formQuestion object
   */
  public async getFormQuestion(id: string): Promise<FormQuestion> {
    const formQuestion = await payload.findByID({
      collection: 'formQuestion',
      id: id,
    })

    return formQuestion
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
    const updatedFormQuestion = await payload.update({
      collection: 'formQuestion',
      id: id,
      data: formQuestion,
    })
    return updatedFormQuestion
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
