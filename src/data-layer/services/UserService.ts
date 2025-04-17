import { User } from '@/payload-types'
import { payload } from '../adapters/Payload'
import { CreateUserData, UpdateUserData } from '@/types/Collections'
import { PaginatedDocs } from 'payload'

export class UserService {
  /**
   * Creates a new user document in the database.
   *
   * @param newUser The new user data object to create
   * @returns The created user document
   */
  public async createUser(newUser: CreateUserData): Promise<User> {
    return await payload.create({
      collection: 'user',
      data: newUser,
    })
  }

  /**
   * Retrieves a user document from the database by its ID.
   *
   * @param userID The ID of the user to retrieve
   * @returns The retrieved user document
   */
  public async getUser(userID: string): Promise<User> {
    return await payload.findByID({
      collection: 'user',
      id: userID,
    })
  }

  /**
   * Retrieves all user documents from the database.
   *
   * @returns The retrieved user documents
   */
  public async getAllUsers(): Promise<PaginatedDocs<User>> {
    return await payload.find({
      collection: 'user',
    })
  }

  /**
   * Updates a user from the database.
   *
   * @param userID the ID of the user to update and
   * @param updatedUser the updated user data object
   * @returns A user document
   */
  public async updateUser(userID: string, updatedUser: UpdateUserData): Promise<User> {
    const result = await payload.update({
      collection: 'user',
      id: userID,
      data: updatedUser,
    })
    return result
  }

  /**
   * Deletes a user from the database.
   *
   * @param userID the ID of the user to delete
   * @returns A user document
   */
  public async deleteUser(userID: string): Promise<void> {
    await payload.delete({
      collection: 'user',
      id: userID,
    })
  }
}
