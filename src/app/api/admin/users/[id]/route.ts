import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types/User'
import { NotFound } from 'payload'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'
import { UserCombinedInfo } from '@/types/Collections'
import { ZodError } from 'zod'

/**
 * Fetches a single user by ID if the request is made by an admin
 *
 * @param param0 The ID of the user to fetch
 * @param _req the NextRequest obj
 * @returns The user data
 */

export const GET = async (
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  },
) => {
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
    if (
      (error as Error).message === 'Value is not JSON serializable' ||
      (error as Error).message === 'Not Found' ||
      error === NotFound
    ) {
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
 * Admins cannot update users with the role of admin
 *
 * @param param0 The ID of the user to update
 * @returns The updated user
 * @param _req
 */
export const PATCH = async (
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  },
) => {
  const { id } = await params
  const userService = new UserService()
  try {
    const user = await userService.getUser(id)
    const body = UpdateUserRequestBody.parse(await _req.json())
    const updatedUser = await userService.updateUser(id, body)
    let introduction = undefined,
      affiliation = undefined
    let userCombinedInfo: UserCombinedInfo
    if (user.role === UserRole.Client) {
      const clientInfo = await userService.getClientAdditionalInfo(id)
      if (clientInfo) {
        introduction = clientInfo.introduction
        affiliation = clientInfo.affiliation
        await userService.updateClientAdditionalInfo(clientInfo.id, {
          ...updatedUser,
          introduction: body.introduction === undefined ? introduction : body.introduction,
          affiliation: body.affiliation === undefined ? affiliation : body.affiliation,
        })
        introduction = introduction === null ? undefined : introduction
        affiliation = affiliation === null ? undefined : affiliation
        userCombinedInfo = {
          ...updatedUser,
          introduction: body.introduction === undefined ? introduction : body.introduction,
          affiliation: body.affiliation === undefined ? affiliation : body.affiliation,
        }
      } else {
        userCombinedInfo = {
          ...updatedUser,
          introduction: body.introduction ? body.introduction : undefined,
          affiliation: body.affiliation ? body.affiliation : undefined,
        }
      }
    } else {
      userCombinedInfo = {
        ...updatedUser,
        introduction: body.introduction ? body.introduction : undefined,
        affiliation: body.affiliation ? body.affiliation : undefined,
      }
    }
    return NextResponse.json(userCombinedInfo)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
