import { Security } from '@/business-layer/middleware/Security'
import type { UserCombinedInfo } from '@/types/Collections'
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { MediaSchema } from '@/types/Payload'
import UserService from '@/data-layer/services/UserService'
import { UserRole } from '@/types/User'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'
import type { RequestWithUser } from '@/types/Requests'

export const UpdateUserRequestBody = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    image: z.union([z.string(), MediaSchema]).nullable().optional(),
    introduction: z.string().optional(),
    affiliation: z.string().optional(),
  })
  .strict()

class RouteWrapper {
  /**
   * GET request to get a user's own information
   *
   * @param req The next request containing the user information
   * @returns The user's own information
   */
  @Security('jwt')
  static async GET(req: RequestWithUser) {
    const { user } = req
    let clientAdditionalInfo
    if (user.role === UserRole.Client || user.role === UserRole.Admin) {
      const userService = new UserService()
      clientAdditionalInfo = await userService.getClientAdditionalInfo(user.id)
      const userInfo = await userService.getUser(user.id)
      return NextResponse.json({
        data: { ...userInfo, ...clientAdditionalInfo },
      })
    }
    return NextResponse.json({
      data: user,
    })
  }

  /**
   * PATCH request to get a user's own information
   *
   * @param req The next request containing the updated user information
   * @param params the user's ID
   * @returns The user's new information
   */
  @Security('jwt')
  static async PATCH(req: RequestWithUser) {
    const { user } = req
    try {
      const body = UpdateUserRequestBody.parse(await req.json())
      const { introduction: bodyIntroduction, affiliation: bodyAffiliation } = body
      const userService = new UserService()
      const updatedUser = await userService.updateUser(user.id, body)
      if (user.role === UserRole.Client || user.role === UserRole.Admin) {
        let clientInfo = await userService.getClientAdditionalInfo(user.id)
        if (!clientInfo) {
          clientInfo = await userService.createClientAdditionalInfo({
            client: updatedUser,
            introduction: bodyIntroduction,
            affiliation: bodyAffiliation,
          })
        } else {
          clientInfo = await userService.updateClientAdditionalInfo(clientInfo.id, {
            ...updatedUser,
            introduction: bodyIntroduction,
            affiliation: bodyAffiliation,
          })
        }
        const { introduction, affiliation } = { ...clientInfo }
        return NextResponse.json({
          data: { ...updatedUser, introduction, affiliation } as UserCombinedInfo,
        })
      }
      return NextResponse.json({ data: updatedUser as UserCombinedInfo })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
export const PATCH = RouteWrapper.PATCH
