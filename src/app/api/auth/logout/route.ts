import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { StatusCodes } from 'http-status-codes'
import { Security } from '@/business-layer/middleware/Security'
import AuthService from '@/business-layer/services/AuthService'
import type { JWTResponse } from '@/types/Middleware'
import { oauth2Client } from '@/business-layer/security/google'

class RouteWrapper {
  @Security('jwt', [])
  static async GET(_req: NextRequest) {
    const cookieStore = await cookies()
    const authService = new AuthService()
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value
    const { accessToken } = authService.decodeJWT(authCookie || '') as JWTResponse
    if (accessToken) await oauth2Client.revokeToken(accessToken)

    cookieStore.delete(AUTH_COOKIE_NAME)
    return NextResponse.json({ message: 'Logged out successfully' }, { status: StatusCodes.OK })
  }
}
export const GET = RouteWrapper.GET
