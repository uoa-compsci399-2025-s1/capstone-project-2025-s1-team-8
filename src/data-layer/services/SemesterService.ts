import { CreateSemesterData, UpdateSemesterData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { Semester } from '@/payload-types'

export class SemesterService {
  /**
   * Creates a new semester document in the database.
   *
   * @param newSemester The new semester data object to create
   * @returns The created semester document
   */
  public async createSemester(newSemester: CreateSemesterData): Promise<Semester> {
    return await payload.create({
      collection: 'semester',
      data: newSemester,
    })
  }
  /**
   * Retrieves a semester document from the database by its ID.
   *
   * @param id The ID of the semester to retrieve
   * @returns The retrieved semester document
   */
  public async getSemester(semesterID: string): Promise<Semester> {
    const result = await payload.find({
      collection: 'semester',
      where: {
        id: {
          equals: semesterID,
        },
      },
    })
    return result.docs[0]
  }

  /**
   * Updates a semester document in the database.
   *
   * @param semesterID The semester document ID to update
   * @param updatedSemester The updated semester data object
   * @returns The updated semester document
   */
  public async updateSemester(
    semesterID: string,
    updatedSemester: UpdateSemesterData,
  ): Promise<Semester> {
    const result = await payload.update({
      collection: 'semester',
      id: semesterID,
      data: updatedSemester,
    })
    return result
  }

  /**
   * Deletes a semester document from the database with target ID.
   *
   * @param semesterID The semester document ID for deletion
   */
  public async deleteSemester(semesterID: string): Promise<void> {
    await payload.delete({
      collection: 'semester',
      id: semesterID,
    })
  }
}
