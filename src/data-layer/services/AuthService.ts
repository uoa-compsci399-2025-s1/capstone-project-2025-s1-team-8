import { Authentication } from '@/payload-types'
import { CreateAuthenticationData, UpdateAuthenticationData } from '@/types/Collections'
import { payload } from '../adapters/Payload'

export default class AuthService {
  /**
   * Method to create an authentication document.
   *
   * @param param0 The data to create an Authentication with
   * @returns The Authentication document
   */
  public async createAuth(newAuthData: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: 'authentication',
      data: newAuthData,
    })
  }

  /**
   * Method to retrieve an authentication document.
   *
   * @param email The email of the authentication to retrieve
   * @returns The Authentication document
   */
  public async getAuthByEmail(email: string): Promise<Authentication> {
    return (
      await payload.find({
        collection: 'authentication',
        where: {
          email: {
            equals: email,
          },
        },
      })
    ).docs[0]
  }

  /**
   * Method to retrieve an authentication document.
   *
   * @param authID The ID of the authentication to retrieve
   * @returns The Authentication document
   */
  public async getAuth(authID: string): Promise<Authentication> {
    return await payload.findByID({
      collection: 'authentication',
      id: authID,
    })
  }

  /**
   * Method to update an authentication document.
   *
   * @param authID The ID of the authentication to update
   * @param param0 The data to update the Authentication with
   * @returns The updated Authentication document
   */
  public async updateAuth(
    authID: string,
    newAuthData: UpdateAuthenticationData,
  ): Promise<Authentication> {
    return await payload.update({
      collection: 'authentication',
      id: authID,
      data: newAuthData,
    })
  }

  /**
   * Method to delete an authentication document.
   *
   * @param authID The ID of the authentication to delete
   * @returns void
   */
  public async deleteAuth(authID: string): Promise<void> {
    await payload.delete({
      collection: 'authentication',
      id: authID,
    })
  }
}
