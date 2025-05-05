import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { z, ZodError } from 'zod'
import { NotFound } from 'payload'

import AuthDataService from '@/data-layer/services/AuthService'
import AuthService from '@/business-layer/services/AuthService'
import UserService from '@/data-layer/services/UserService'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { UserRole } from '@/types/User'

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>

export const POST = async (req: NextRequest) => {
  const authDataService = new AuthDataService()
  const authService = new AuthService()
  const userService = new UserService()

  try {
    const { email, password } = LoginRequestBodySchema.parse(await req.json())
    const auth = await authDataService.getAuthByEmail(email)
    const user = await userService.getUserByEmail(email)

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
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
