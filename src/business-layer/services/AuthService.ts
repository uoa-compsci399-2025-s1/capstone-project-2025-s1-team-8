import { User } from '@/payload-types'
import jwt from 'jsonwebtoken'

export default class AuthService {
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
        profile: user,
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
}
