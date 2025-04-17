import { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { FormQuestion } from '@/payload-types'
import { ProjectStatus } from '@/types/Project'

export class FormQuestionService {
  /**
   * Creates a new formQuestion
   *
   * @param newFormQuestion The data for the new formQuestion
   * @returns The created formQuestion
   */
  public async createFormQuestion(
    newFormQuestion: CreateFormQuestionData,
  ): Promise<FormQuestion> {
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
    Retrieves all formQuestions by Status
    * @param status The status of the formQuestions to retrieve
    * @returns An array of formQuestions with the specified status
    **/
  public async getFormQuestionsByStatus(status: ProjectStatus): Promise<FormQuestion[]> {
    const formQuestions = await payload.find({
      collection: 'formQuestion',
      where: {
        status: {
          equals: status,
        },
      },
    })
    return formQuestions.docs
  }

  /**
   * Retrieves all formQuestions by semester ID
   * @param id The semester ID
   * @returns An array of formQuestions associated with the specified semester ID
   */
    public async getFormQuestionsBySemester(id: string): Promise<FormQuestion[]> {
        const formQuestions = await payload.find({
        collection: 'formQuestion',
        where: {
            semester: {
            equals: id,
            },
        },
        })
        return formQuestions.docs
    }

    /**
     * Retrieves all formQuestions by publish status
     * @param published The publish status
     * @returns An array of formQuestions with the specified publish status
     */
    public async getFormQuestionsByPublished(published: boolean): Promise<FormQuestion[]> {
        const formQuestions = await payload.find({
        collection: 'formQuestion',
        where: {
            published: {
            equals: published,
            },
        },
        })
        return formQuestions.docs
    }
    /**
     * Retrieves all formQuestions by number
     * @param number The formQuestion number
     * @returns A formQuestion with the specified number
     */
    public async getFormQuestionByNumber(number: number): Promise<FormQuestion> {
        const formQuestion = await payload.find({
        collection: 'formQuestion',
        where: {
            number: {
            equals: number,
            },
        },
        })
        return formQuestion.docs[0]
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
