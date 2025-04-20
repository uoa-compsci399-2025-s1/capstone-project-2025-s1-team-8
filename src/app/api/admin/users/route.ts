import { NextRequest, NextResponse } from 'next/server'

import UserService from '@/data-layer/services/UserService'
import { UserRole } from '@/types/User'

/**
 * Method to fetch all users
 *
 * @param _req The Next Request context
 * @param param1 The query parameters, including limit and cursor
 * @returns
 */
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const limit = parseInt(searchParams.get('limit') || '10') // default value as fallback
  const cursor = parseInt(searchParams.get('cursor') || '0')

  if (limit > 100 || limit < 0) {
    return NextResponse.json({ error: 'Invalid fetch limit' }, { status: 400 })
  }
  const userService = new UserService()
  const { docs: rawUserData, nextPage } = await userService.getAllUsers(limit, cursor)

  const combinedUserData = await Promise.all(
    rawUserData.map(async (userInfo) => {
      if (userInfo.role === UserRole.Client) {
        const { introduction, affiliation } = {
          ...(await userService.getClientAdditionalInfo(userInfo.id)),
        }
        return { ...userInfo, introduction, affiliation }
      }
      return userInfo
    }),
  )

  return NextResponse.json({ data: combinedUserData, nextCursor: nextPage })
}
