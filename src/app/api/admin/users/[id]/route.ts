import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import { UserRole } from '@/types/User'
import { NotFound } from 'payload'
import { UpdateUserRequestBody } from '@/types/request-models/UserRequests'

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
      return Response.json({ ...user, introduction, affiliation })
    }
    return Response.json(user)
  } catch (error) {
    if (
      (error as Error).message === 'Value is not JSON serializable' ||
      (error as Error).message === 'Not Found' ||
      error === NotFound
    ) {
      return Response.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
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
      clientInfo.introduction = body.introduction ?? clientInfo.introduction
      clientInfo.affiliation = body.affiliation ?? clientInfo.affiliation
      return Response.json(clientInfo)
    } else if (user.role === UserRole.Student) {
      return Response.json(updatedUser)
    }
    return Response.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
  } catch (error) {
    if (
      (error as Error).message == 'Value is not JSON serializable' ||
      (error as Error).message == 'Not Found'
    ) {
      return Response.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
