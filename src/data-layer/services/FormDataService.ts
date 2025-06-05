import type { Form, FormQuestion } from '@/payload-types'
import type {
  CreateFormData,
  UpdateFormData,
  UpdateFormQuestionData,
  CreateFormQuestionData,
} from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { NotFound } from 'payload'

export default class FormDataService {
  /**
   * Creates a new form document in the database.
   *
   * @param newForm The new form data object to create
   * @returns The created form document
   */
  public async createForm(newForm: CreateFormData): Promise<Form> {
    return await payload.create({
      collection: 'form',
      data: newForm,
    })
  }

  /**
   * Retrieves a form document from the database by its ID.
   *
   * @returns The retrieved form document
   */
  public async getForm(): Promise<Form> {
    const form = (
      await payload.find({
        collection: 'form',
      })
    ).docs[0]
    if (!form) {
      throw new NotFound(() => 'Not Found')
    }
    return form
  }

  /**
   * Updates a form from the database.
   *
   * @param updatedForm the updated form data object
   * @returns An a form document
   */
  public async updateForm(updatedForm: UpdateFormData): Promise<Form> {
    const form = await this.getForm()
    return await payload.update({
      collection: 'form',
      id: form.id,
      data: updatedForm,
    })
  }

  /**
   * Deletes a form from the database.
   *
   * @param formID the ID of the form to delete
   * @returns A form document
   */
  public async deleteForm(formID: string): Promise<void> {
    await payload.delete({
      collection: 'form',
      id: formID,
    })
  }

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
