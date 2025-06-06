import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { NotFound } from 'payload'

import AuthDataService from '@/data-layer/services/AuthDataService'
import AuthService from '@/business-layer/services/AuthService'
import UserDataService from '@/data-layer/services/UserDataService'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/types/Auth'

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>

export const POST = async (req: NextRequest) => {
  const authService = new AuthService()
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()

  try {
    const { email, password } = LoginRequestBodySchema.parse(await req.json())
    const auth = await authDataService.getAuthByEmail(email)
    const user = await userDataService.getUserByEmail(email)

    const isValid = await authService.verifyPassword(password, auth.password || '')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCodes.UNAUTHORIZED },
      )
    }

    const token = authService.generateJWT(user)
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    })

    return NextResponse.json({ message: 'Login successful', redirect: `/${user.role}` })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    } else if (error instanceof NotFound) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCodes.UNAUTHORIZED },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
