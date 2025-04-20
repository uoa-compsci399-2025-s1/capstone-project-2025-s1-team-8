import { ClientAdditionalInfo, User } from '@/payload-types'
import { payload } from '../adapters/Payload'
import {
  CreateClientAdditionalInfoData,
  CreateUserData,
  UpdateClientAdditionalInfoData,
  UpdateUserData,
} from '@/types/Collections'
import { PaginatedDocs } from 'payload'

export default class UserService {
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

  public async getUserByEmail(email: string): Promise<User> {
    return (
      await payload.find({
        collection: 'user',
        where: {
          email: {
            equals: email,
          },
        },
      })
    ).docs[0]
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

  /*
   * Client Additional Info service methods
   */

  /**
   * Creates a new client additional info document
   *
   * @param clientAdditionalInfo The additional client information
   * @returns The created client additional info document
   */
  public async createClientAdditionalInfo(
    clientAdditionalInfo: CreateClientAdditionalInfoData,
  ): Promise<ClientAdditionalInfo> {
    return await payload.create({
      collection: 'clientAdditionalInfo',
      data: clientAdditionalInfo,
    })
  }

  /**
   * Retrieves a client additional info document by ID
   *
   * @param clientID The ID of the client additional info document to retrieve
   * @returns The client additional info document
   */
  public async getClientAdditionalInfo(clientID: string): Promise<ClientAdditionalInfo> {
    return (
      await payload.find({
        collection: 'clientAdditionalInfo',
        where: { user: { equals: clientID } },
      })
    ).docs[0]
  }

  /**
   * Updates a client additional info document by ID
   *
   * @param clientID The ID of the client additional info document to update
   * @param updatedClientAdditionalInfo The updated client additional info data
   * @returns The updated client additional info document
   */
  public async updateClientAdditionalInfo(
    clientID: string,
    updatedClientAdditionalInfo: UpdateClientAdditionalInfoData,
  ): Promise<ClientAdditionalInfo> {
    const result = await payload.update({
      collection: 'clientAdditionalInfo',
      id: clientID,
      data: updatedClientAdditionalInfo,
    })
    return result
  }

  /**
   * Deletes a client additional info document by ID
   *
   * @param clientID The ID of the client additional info document to delete
   * @returns A promise that resolves when the document is deleted
   */
  public async deleteClientAdditionalInfo(clientID: string): Promise<void> {
    await payload.delete({
      collection: 'clientAdditionalInfo',
      id: clientID,
    })
  }
}
