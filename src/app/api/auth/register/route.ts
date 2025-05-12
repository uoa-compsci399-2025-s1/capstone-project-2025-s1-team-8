import AuthService from '@/business-layer/services/AuthService'
import UserService from '@/data-layer/services/UserService'
import AuthDataService from '@/data-layer/services/AuthService'
import { CreateUserData } from '@/types/Collections'
import { UserRoleWithoutAdmin } from '@/types/User'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { User } from '@/payload-types'

export const RegisterRequestBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.nativeEnum(UserRoleWithoutAdmin),
})
export type RegisterRequestBody = z.infer<typeof RegisterRequestBodySchema>

export const POST = async (req: NextRequest) => {
  const userService = new UserService()
  const authService = new AuthService()
  const authDataService = new AuthDataService()

  try {
    const body = RegisterRequestBodySchema.parse(await req.json())
    let user: User

    const auth = await authDataService.getAuthByEmail(body.email)
    if (auth)
      return NextResponse.json(
        { error: 'A user with that email already exists' },
        { status: StatusCodes.CONFLICT },
      )

    try {
      user = await userService.getUserByEmail(body.email)
    } catch {
      user = await userService.createUser(body as CreateUserData)
    }

    const hash = await authService.hashPassword(body.password)
    await authDataService.createAuth({
      email: body.email,
      password: hash,
    })

    return NextResponse.json(
      { message: 'User registered successfully', data: user },
      {
        status: StatusCodes.CREATED,
      },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    console.error('Error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
