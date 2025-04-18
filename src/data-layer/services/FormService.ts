import { FormResponse } from '@/payload-types'
import { CreateFormResponseData, UpdateFormResponseData } from '@/types/Collections'
import { payload } from '../adapters/Payload'

export class FormService {
  /*
   * Form Response Method
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
