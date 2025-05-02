import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import { UserRole } from '@/types/User'
import UserService from '@/data-layer/services/UserService'
import AuthService from '@/data-layer/services/AuthService'
import BusinessAuthService from '@/business-layer/services/AuthService'
import { AUTH_COOKIE_NAME, UserInfoResponse, UserInfoResponseSchema } from '@/types/Auth'
import { CreateUserData } from '@/types/Collections'
import { User } from '@/payload-types'

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const cookieStore = await cookies()

  const state = params.get('state')
  const cookieState = cookieStore.get('state')
  if (!state || !cookieState?.value || state.toString() !== cookieState.value.toString()) {
    return NextResponse.json(
      { error: "State missing, or state doesn't match browser state. " },
      {
        status: 400,
      },
    )
  }
  cookieStore.delete('state')

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

  const userService = new UserService()
  let user: User
  try {
    user = await userService.getUserByEmail(email)
  } catch {
    const newUserData: CreateUserData = {
      email,
      firstName,
      lastName: lastName || '',
      role: UserRole.Client,
    }
    user = await userService.createUser(newUserData)
  }

  const authService = new AuthService()
  const fetchedAuth = await authService.getAuthByEmail(email)
  if (fetchedAuth) {
    await authService.updateAuth(fetchedAuth.id, {
      accessToken: tokens.access_token,
      expiresAt: tokens.expiry_date,
      scope: scopes.join(' '),
      idToken: tokens.id_token,
    })
  } else {
    await authService.createAuth({
      email,
      type: 'oauth',
      provider: 'google',
      providerAccountId: sub,
      accessToken: tokens.access_token,
      expiresAt: tokens.expiry_date,
      scope: scopes.join(' '),
      idToken: tokens.id_token,
    })
  }

  const businessAuthService = new BusinessAuthService()
  const token = businessAuthService.generateJWT(user, tokens.access_token)

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
  })

  return redirect("/")
}
