import { Form } from '@/payload-types'
import { payload } from '../adapters/Payload'
import { CreateFormData, UpdateFormData } from '@/types/Collections'

export class FormService {
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
}
