import { Form, FormResponse } from '@/payload-types'
import {
  CreateFormData,
  CreateFormResponseData,
  UpdateFormData,
  UpdateFormResponseData,
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
}
