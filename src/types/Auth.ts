import z from 'zod'

export const AUTH_COOKIE_NAME = 'auth_token'

export const SALT_ROUNDS = 10

export const UserInfoResponseSchema = z.object({
  /**
   * The unique ID of a Google user
   * @example 111111111111111111111
   */
  sub: z.string(),
  /**
   * The full name of the Google user
   * @example Jeffery Ji
   */
  name: z.string(),
  /**
   * The user's first name
   * @example Jeffery
   */
  given_name: z.string(),
  /**
   * The user's first name
   * @example Ji
   */
  family_name: z.string().optional(),
  /**
   * The user's profile picture URL
   */
  picture: z.string(),
  /**
   * The user's email address
   * @example jefferyji@gmail.com
   */
  email: z.string(),
  email_verified: z.boolean(),
  /**
   * The hosted domain that the Google account is associated with
   * @example aucklanduni.ac.nz
   */
  hd: z.string().optional(),
})

export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
