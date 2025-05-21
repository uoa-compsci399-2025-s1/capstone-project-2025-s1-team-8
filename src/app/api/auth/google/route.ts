import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import { UserRoleWithoutAdmin } from '@/types/User'
import AuthService from '@/business-layer/services/AuthService'

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const role = (params.get('role') || UserRoleWithoutAdmin.Client) as UserRoleWithoutAdmin

  if (!Object.values(UserRoleWithoutAdmin).includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: StatusCodes.BAD_REQUEST })
  }
  const authService = new AuthService()
  const state = authService.generateState(role)
  const cookieStore = await cookies()
  // Set state to prevent CSRF attacks
  cookieStore.set('state', state, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    /**
     * Should be set at less than 10 minutes but for security, best for 60 seconds or less
     * https://www.oauth.com/oauth2-servers/authorization/the-authorization-response/
     */
    maxAge: 60,
  })

  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: googleAuthScopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Set state for CSRF attack prevention
    state,
  })
  return redirect(authorizationUrl)
}
