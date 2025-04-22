import { Form, FormResponse, FormQuestion } from '@/payload-types'
import {
  CreateFormData,
  CreateFormResponseData,
  UpdateFormData,
  UpdateFormResponseData,
  UpdateFormQuestionData,
  CreateFormQuestionData,
} from '@/types/Collections'
import { payload } from '../adapters/Payload'

export default class FormService {
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
   * @param formID The ID of the form to retrieve
   * @returns The retrieved form document
   */
  public async getForm(formID: string): Promise<Form> {
    return await payload.findByID({
      collection: 'form',
      id: formID,
    })
  }

  /**
   * Updates a form from the database.
   *
   * @param formID the ID of the form to update and
   * @param updatedForm the updated form data object
   * @returns An a form document
   */
  public async updateForm(formID: string, updatedForm: UpdateFormData): Promise<Form> {
    const result = await payload.update({
      collection: 'form',
      id: formID,
      data: updatedForm,
    })
    return result
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

  /*
   * Form Response Methods
   */

  /**
   * Creates a new form response document in the database.
   *
   * @param newFormResponse The new form response data object to create
   * @returns The created form response document
   */
  public async createFormResponse(newFormResponse: CreateFormResponseData): Promise<FormResponse> {
    return await payload.create({
      collection: 'formResponse',
      data: newFormResponse,
    })
  }

  /**
   * Retrieves a form response document from the database by its ID.
   *
   * @param formResponseID the ID of the form response document to retrieve
   * @returns
   */
  public async getFormResponse(formResponseID: string): Promise<FormResponse> {
    return await payload.findByID({
      collection: 'formResponse',
      id: formResponseID,
    })
  }

  /**
   * Updates a form response document in the database
   *
   * @param formResponseID The form response document ID to update
   * @param updatedFormResponse The updated form response data object
   * @returns The updated form response object
   */
  public async updateFormResponse(
    formResponseID: string,
    updatedFormResponse: UpdateFormResponseData,
  ): Promise<FormResponse> {
    return await payload.update({
      collection: 'formResponse',
      id: formResponseID,
      data: updatedFormResponse,
    })
  }

  /**
   * Deletes a form response document from the database with target ID.
   *
   * @param formResponseID The form response document ID to delete
   */
  public async deleteFormResponse(formResponseID: string): Promise<void> {
    await payload.delete({
      collection: 'formResponse',
      id: formResponseID,
    })
  }

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
