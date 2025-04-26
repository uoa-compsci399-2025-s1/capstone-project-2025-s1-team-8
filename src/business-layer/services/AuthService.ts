import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { User } from '@/payload-types'
import { SALT_ROUNDS } from '@/types/Auth'

export default class AuthService {
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
  public verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }

  /**
   * Generates a JWT token for the given user and access token.
   *
   * @param user The user data to tokenize
   * @param accessToken The Google OAuth access token to include in the JWT payload
   * @returns The generated JWT token
   */
  public generateJWT(user: User, accessToken: string): string {
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
