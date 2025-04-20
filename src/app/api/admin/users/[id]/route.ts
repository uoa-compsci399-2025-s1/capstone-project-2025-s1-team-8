import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import { CreateClientAdditionalInfoData } from '@/types/Collections'
import { User } from '@/payload-types'

/**
 * Fetches a single user by ID if the request is made by an admin
 *
 * @param param0 The ID of the user to fetch
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
    // cannot be found with an ID supplied in the payload admin dashboard - this ID SHOULD WORK ???
    const user = await userService.getUser(id)
    const clientInfo = {
      client: user,
      introduction: null,
      affiliation: null
    }
    const clientAdditionalInfo = await userService.createClientAdditionalInfo(clientInfo)
    return Response.json(clientAdditionalInfo)
  } catch (error) {
    if ((error as Error).message == 'Not Found') {
      return Response.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
