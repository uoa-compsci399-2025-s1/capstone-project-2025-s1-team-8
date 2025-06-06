import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import { UserRole } from '@/types/User'
import UserDataService from '@/data-layer/services/UserDataService'
import AuthDataService from '@/data-layer/services/AuthDataService'
import BusinessAuthService from '@/business-layer/services/AuthService'
import type { UserInfoResponse } from '@/types/Auth'
import { AUTH_COOKIE_NAME, UserInfoResponseSchema } from '@/types/Auth'
import type { User } from '@/payload-types'

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const cookieStore = await cookies()
  const businessAuthService = new BusinessAuthService()

  const state = params.get('state')
  const cookieState = cookieStore.get('state')
  if (!state || !cookieState?.value || state.toString() !== cookieState.value.toString()) {
    return NextResponse.json(
      { error: "State missing or state doesn't match browser state. " },
      {
        status: 400,
      },
    )
  }
  cookieStore.delete('state')
  const role = businessAuthService.decryptState(state)

  const code = params.get('code')
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

  const scopes = params.get('scope')?.split(' ')
  if (!scopes || googleAuthScopes.some((requiredScope) => !scopes.includes(requiredScope)))
    return NextResponse.json({ error: 'No scope or invalid scopes provided' }, { status: 400 })

  let tokens
  try {
    const tokenFetchResponse = await oauth2Client.getToken(code)
    tokens = tokenFetchResponse.tokens
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Error invalid google auth' }, { status: 500 })
  }
  if (!tokens.access_token || !tokens.expiry_date || !tokens.id_token) {
    return NextResponse.json({ error: 'Error invalid google auth' }, { status: 500 })
  }

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const {
    sub,
    email,
    family_name: lastName,
    given_name: firstName,
  }: UserInfoResponse = UserInfoResponseSchema.parse(await userInfoResponse.json())

  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()

  const fetchedAuth = await authDataService.getAuthByEmail(email)
  let user: User
  try {
    user = await userDataService.getUserByEmail(email)
    if (!fetchedAuth) {
      user = await userDataService.updateUser(user.id, {
        firstName,
        lastName,
      })
    }
  } catch {
    // Redirects to register if the user attempts to login with a Google account that is not registered
    if (!role) return redirect('/auth/register')
    user = await userDataService.createUser({
      email,
      firstName,
      lastName,
      role,
    })
  }

  if (fetchedAuth) {
    await authDataService.updateAuth(fetchedAuth.id, {
      provider: 'google',
      providerAccountId: sub,
      accessToken: tokens.access_token,
      expiresAt: tokens.expiry_date,
      scope: scopes.join(' '),
      idToken: tokens.id_token,
    })
  } else {
    await authDataService.createAuth({
      email,
      provider: 'google',
      providerAccountId: sub,
      accessToken: tokens.access_token,
      expiresAt: tokens.expiry_date,
      scope: scopes.join(' '),
      idToken: tokens.id_token,
    })
  }

  const token = businessAuthService.generateJWT(user, tokens.access_token)

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  })

  switch (user.role) {
    case UserRole.Admin:
      return redirect('/admin')
    case UserRole.Client:
      return redirect('/client')
    case UserRole.Student:
      return redirect('/student')
    default:
      return redirect('/')
  }
}
