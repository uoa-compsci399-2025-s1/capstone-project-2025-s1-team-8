import { cookies, headers } from 'next/headers'

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
    const headersList = await headers()
    return new Promise((resolve, reject) => {
      try {
        let token: string = cookieStore.get(AUTH_COOKIE_NAME)?.value || ''

        // Enable header based auth when NODE_ENV set the test mode
        if (process.env.NODE_ENV !== 'production') {
          console.log('yolo')
          const authHeader = headersList.get('authorization') || ''
          if (!token && !authHeader.startsWith('Bearer '))
            return reject(new UnauthorizedAuthError('No token provided'))
          else if (!token) token = authHeader.split(' ')[1] // Gets part after Bearer
        }

        if (!token) return reject(new UnauthorizedAuthError('No token provided'))
        const authService = new AuthService()
        const decodedToken = authService.decodeJWT(token) as JWTResponse
        const { user } = decodedToken
        if (!scopes?.length) {
          return resolve(user)
        }
        for (const scope of scopes || []) {
          if (user.role.includes(scope)) {
            return resolve(user)
          }
        }
        return reject(new UnauthorizedAuthError('No scope'))
      } catch (error) {
        console.error(error)
        return reject(new UnauthorizedAuthError(String(error)))
      }
    })
  }
}
