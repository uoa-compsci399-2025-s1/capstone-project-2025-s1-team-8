import { cookies } from 'next/headers'
import AuthService from '../services/AuthService'
import { JWTResponse } from '@/types/Middleware'

export class UnauthorizedAuthError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, UnauthorizedAuthError.prototype)
  }
}

export function payloadAuthentication(securityName: string, scopes?: string[]) {
  if (securityName === 'jwt') {
    return new Promise((resolve, reject) => {
      cookies().then((cookies) => {
        const token = cookies.get('auth_token')?.value
        if (!token) {
          return reject(new UnauthorizedAuthError('No token provided'))
        }
        const authService = new AuthService()
        const decodedToken = authService.decodeJWT(token) as JWTResponse
        const { user } = decodedToken
        if (!scopes?.includes(user.role)) return reject(new UnauthorizedAuthError('No scope'))
        return resolve(user)
      })
    })
  }
  return Promise.reject(new Error('Unknown Error'))
}
