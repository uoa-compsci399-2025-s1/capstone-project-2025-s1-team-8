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
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if(!token)
      throw new UnauthorizedAuthError('No token provided')
    const authService = new AuthService()
    const decodedToken = authService.decodeJWT(token) as JWTResponse
    const { user } = decodedToken
    for (const scope of scopes || []) {
      if (!(user.role.includes(scope))) {
        throw new UnauthorizedAuthError('No scope')
      }
    }
    return user
  }
}
