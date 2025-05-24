'use server'
import { cookies, headers } from 'next/headers'

import AuthService from '../services/AuthService'
import type { JWTResponse } from '@/types/Middleware'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { UnauthorizedAuthError } from './errors'

/**
 * The payloadAuthentication function is used to authenticate a user based on the provided security name and scopes.
 *
 * @param securityName The security name, only JWT is supported
 * @param scopes The scopes to check for, if not provided, no scope check is performed
 * @returns A promise that resolves to the user object if the authentication is successful, otherwise rejects with an error
 */
export async function payloadAuthentication(securityName: 'jwt', scopes?: string[]) {
  if (securityName === 'jwt') {
    const cookieStore = await cookies()
    try {
      let token: string = cookieStore.get(AUTH_COOKIE_NAME)?.value || ''

      // Enable header based auth when NODE_ENV set the test mode
      if (process.env.NODE_ENV !== 'production') {
        const headersList = await headers()
        const authHeader = headersList.get('authorization') || ''
        if (!token && !authHeader.startsWith('Bearer '))
          throw new UnauthorizedAuthError('No token provided')
        else if (!token) token = authHeader.split(' ')[1] // Gets part after Bearer
      }

      if (!token) throw new UnauthorizedAuthError('No token provided')
      const authService = new AuthService()
      const decodedToken = authService.decodeJWT(token) as JWTResponse
      const { user } = decodedToken

      if (!scopes?.length) {
        return user
      }
      for (const scope of scopes || []) {
        if (user.role.includes(scope)) {
          return user
        }
      }
      throw new UnauthorizedAuthError('No scope')
    } catch (error) {
      if (!(error instanceof UnauthorizedAuthError)) console.error(error)
      throw new UnauthorizedAuthError(String(error))
    }
  } else {
    throw new Error('Unsupported security name')
  }
}
