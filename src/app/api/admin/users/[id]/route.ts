import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

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
    // const user = await userService.getUser(id)
    const clientInfo = await userService.getClientAdditionalInfo(id)
    // const clientInfo = {
    //   client: user,
    //   introduction: null,
    //   affiliation: null,
    // }
    // const clientAdditionalInfo = await userService.createClientAdditionalInfo(clientInfo)
    return Response.json(clientInfo)
  } catch (error) {
    if ((error as Error).message == 'Value is not JSON serializable') {
      return Response.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
