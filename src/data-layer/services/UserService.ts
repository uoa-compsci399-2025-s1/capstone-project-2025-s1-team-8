import type { Where, PaginatedDocs } from 'payload'
import { NotFound } from 'payload'

import type { ClientAdditionalInfo, User } from '@/payload-types'
import { payload } from '../adapters/Payload'
import type {
  CreateClientAdditionalInfoData,
  CreateUserData,
  UpdateClientAdditionalInfoData,
  UpdateUserData,
} from '@/types/Collections'
import type { UserRole } from '@/types/User'

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
    const res = await payload.find({
      collection: 'user',
      where: {
        email: {
          equals: email,
        },
      },
    })
    if (!res.docs[0]) throw new NotFound()
    return res.docs[0]
  }

  /**
   * Retrieves a paginated list of user documents from the database.
   *
   * @param options Optional parameters for pagination and filtering
   * - limit The maximum number of users to return (defaults to 100)
   * - page The page number for pagination (defaults to 1)
   * - role Filter users by their role (optional)
   * - query A search query to filter users by first or last name (optional)
   * @returns A paginated list of user documents
   */
  public async getAllUsers(
    options: {
      limit?: number
      page?: number
      role?: UserRole
      query?: string
    } = {
      limit: 100,
      page: 1,
    },
  ): Promise<PaginatedDocs<User>> {
    return await payload.find({
      collection: 'user',
      where: {
        role: options.role
          ? {
              equals: options.role,
            }
          : {},
        and: options.query
          ? options.query.split(/ /g).map((token) => ({
              or: [{ firstName: { like: token } }, { lastName: { like: token } }] as Where[],
            }))
          : [],
      },
      limit: options.limit,
      pagination: true,
      page: options.page,
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
        where: { client: { equals: clientID } },
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
