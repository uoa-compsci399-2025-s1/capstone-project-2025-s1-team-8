import { cookies } from 'next/headers'

import AuthService from '../services/AuthService'
import { JWTResponse } from '@/types/Middleware'
import { AUTH_COOKIE_NAME } from '@/types/Auth'

export class UnauthorizedAuthError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, UnauthorizedAuthError.prototype)
  }
}

export async function payloadAuthentication(securityName: string, scopes?: string[]) {
  if (securityName === 'jwt') {
    const cookieStore = await cookies()
    return new Promise((resolve, reject) => {
      try {
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
        if (!token) return reject(new UnauthorizedAuthError('No token provided'))
        const authService = new AuthService()
        const decodedToken = authService.decodeJWT(token) as JWTResponse
        const { user } = decodedToken
        for (const scope of scopes || []) {
          if (user.role.includes(scope)) {
            resolve(user)
          }
        }
        if (scopes?.length === 0) {
          return resolve(user)
        }
        return reject(new UnauthorizedAuthError('No scope'))
      } catch (error) {
        console.error(error)
        return reject(new UnauthorizedAuthError(String(error)))
      }
    })
  }
}
