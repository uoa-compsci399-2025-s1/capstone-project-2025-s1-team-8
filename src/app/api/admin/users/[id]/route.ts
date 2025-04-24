import { ZodError } from 'zod'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'

import UserService from '@/data-layer/services/UserService'
import { UserRole } from '@/types/User'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'
import { UserCombinedInfo } from '@/types/Collections'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * Fetches a single user by ID if the request is made by an admin
   *
   * @param param0 The ID of the user to fetch
   * @param _req the NextRequest obj
   * @returns The user data
   */
  @Security("jwt", ["admin"])
  static async GET(
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const userService = new UserService()
    try {
      const user = await userService.getUser(id)
      if (user.role === UserRole.Client) {
        const { introduction, affiliation } = { ...(await userService.getClientAdditionalInfo(id)) }
        return NextResponse.json({ ...user, introduction, affiliation })
      }
      return NextResponse.json(user)
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Updates a single user by ID if the request is made by an admin
   *
   * @param param0 The ID of the user to update
   * @returns The updated user
   * @param _req
   */
  @Security("jwt", ["admin"])
  static async PATCH(
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const userService = new UserService()
    try {
      const user = await userService.getUser(id)
      const body = UpdateUserRequestBody.parse(await _req.json())
      const updatedUser = await userService.updateUser(id, body)
      const { introduction: bodyIntroduction, affiliation: bodyAffiliation } = body
      if (user.role === UserRole.Client || user.role === UserRole.Admin) {
        let clientInfo = await userService.getClientAdditionalInfo(id)
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
        return NextResponse.json({ ...updatedUser, introduction, affiliation } as UserCombinedInfo)
      }
      return NextResponse.json(updatedUser as UserCombinedInfo)
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
        { error: 'Internal Server Error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Method to delete a user by Id.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security("jwt", ["admin"])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const userService = new UserService()
      await userService.deleteUser(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
      } else {
        console.error(error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }
  }
}

export const GET = RouteWrapper.GET,
  PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
