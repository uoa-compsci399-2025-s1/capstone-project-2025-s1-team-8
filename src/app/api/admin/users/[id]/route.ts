import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types/User'
import { NotFound } from 'payload'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'

// also return UserCombinedInfo object instead of ClientInfo
// admins can edit themselves lmaoooo

// remove slug and remove bodyJson varaiable

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

    if (user.role === UserRole.Client) {
      const clientInfo = await userService.getClientAdditionalInfo(id)
      if (!clientInfo) {
        const newClientInfo = await userService.createClientAdditionalInfo({
          client: id,
          introduction: null,
          affiliation: null,
        })
        return NextResponse.json(newClientInfo)
      } else {
        const updatedClientInfo = await userService.updateClientAdditionalInfo(clientInfo.id, {
          introduction: body.introduction,
          affiliation: body.affiliation,
        })
        return NextResponse.json(updatedClientInfo)
      }
    }
    else if (user.role === UserRole.Student) {
      return NextResponse.json(updatedUser)
    }

  } catch (error) {
    if (
      (error as Error).message == 'Value is not JSON serializable' ||
      (error as Error).message == 'Not Found'
    ) {
      return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
