import { CreateSemesterData, UpdateSemesterData } from '@/types/Collections'
import { payload } from '../adapters/Payload'
import { Semester } from '@/payload-types'
import { PaginatedDocs, Sort, Where } from 'payload'
import { SemesterType } from '@/types/Semester'

export default class SemesterService {
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
    return await payload.findByID({
      collection: 'semester',
      id: semesterID,
    })
  }

  /**
   * Retrieves all semester documents from the database.
   *
   * @returns The retrieved semester documents
   */
  public async getAllSemesters(
    limit: number = 100,
    page: number = 1,
    timeframe: SemesterType = SemesterType.Default,
  ): Promise<PaginatedDocs<Semester>> {
    const currentDate = new Date().toISOString()

    let filter: Where = {}
    let sort: Sort = []

    switch (timeframe) {
      case SemesterType.Current:
        filter = {
          and: [
            {
              startDate: {
                less_than_equal: currentDate,
              },
            },
            {
              endDate: {
                greater_than_equal: currentDate,
              },
            },
          ],
        }
        break
      case SemesterType.Upcoming:
        filter = {
          startDate: {
            greater_than: currentDate,
          },
        }
        break
      case SemesterType.Next:
        filter = {
          startDate: {
            greater_than: currentDate,
          },
        }
        limit = 1
        sort = ['startDate', 'endDate']
        break
      case SemesterType.Past:
        filter = {
          endDate: {
            less_than: currentDate,
          },
        }
        break
      default:
    }

    const data = await payload.find({
      collection: 'semester',
      limit,
      pagination: true,
      page: page,
      where: filter,
      sort,
    })
    return data
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

  public async getCurrentSemester(): Promise<Semester> {
    const currentDate = new Date().toISOString()
    return (
      await payload.find({
        collection: 'semester',
        where: {
          and: [
            {
              startDate: {
                less_than_equal: currentDate,
              },
            },
            {
              endDate: {
                greater_than_equal: currentDate,
              },
            },
          ],
        },
      })
    ).docs[0]
  }
}
