import UserService from '@/data-layer/services/UserService'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import { UserRole } from '@/types/User'

/**
 * Fetches a single user by ID if the request is made by an admin
 *
 * @param param0 The ID of the user to fetch
 * @returns The user data
 * @param _req
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
    console.log(user)
    if (user.role === UserRole.Client) {
      const { introduction, affiliation } = {...(await userService.getClientAdditionalInfo(id))}
      return Response.json({ ...user, introduction, affiliation, })
    }
    return Response.json(user)

  } catch (error) {
    if ((error as Error).message == 'Value is not JSON serializable' || (error as Error).message == 'Not Found') {
      return Response.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
