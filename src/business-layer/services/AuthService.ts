import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { User } from '@/payload-types'
import { SALT_ROUNDS } from '@/types/Auth'
import { UserRoleWithoutAdmin } from '@/types/User'

export default class AuthService {
  /**
   * Generates a state with internal role.
   * Generates this state by joining a random UUID generated with crypto and joining the role by a semicolon.
   *
   * @param role The {@link UserRoleWithoutAdmin} to encrypt with a state
   * @returns The state and role in base64
   */
  public generateState(role: UserRoleWithoutAdmin): string {
    return Buffer.from(crypto.randomUUID().toString() + ';' + role).toString('base64')
  }

  /**
   * Used to decrypt a state with user role
   *
   * @param state The state to decrypt
   * @returns The user role that's decrypted
   */
  public decryptState(state: string): UserRoleWithoutAdmin {
    return Buffer.from(state, 'base64').toString().split(';')[1] as UserRoleWithoutAdmin
  }

  /**
   * Hashes a plain text password using bcrypt.
   *
   * @param password The plain text password to encrypt
   * @returns The password hash
   */
  public async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
  }

  /**
   * Verifies a plain text password against a hashed password using bcrypt.
   *
   * @param password The plain text password to check
   * @param hash The hashed password to compare against
   * @returns Boolean value indicating whether the password matches the hash
   */
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Generates a JWT token for the given user and access token.
   *
   * @param user The user data to tokenize
   * @param accessToken The Google OAuth access token to include in the JWT payload
   * @returns The generated JWT token
   */
  public generateJWT(user: User, accessToken?: string): string {
    return jwt.sign(
      {
        user,
        accessToken,
      },
      process.env.JWT_SECRET,
      /**
       * JWT token including user info and the Google access token.
       * Expires in 1 hour (same duration as Google access token)
       */
      { expiresIn: '1h' },
    )
  }

  /**
   * Decodes a JWT token and returns the payload.
   *
   * @param token The JWT token to decode
   * @returns The decoded JWT payload
   */
  public decodeJWT(token: string): JwtPayload | string {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}
