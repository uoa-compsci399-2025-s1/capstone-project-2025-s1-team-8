import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import UserService from '@/data-layer/services/UserService'
import { UserRole } from '@/types/User'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * Method to fetch all users
   *
   * @param _req The Next Request context
   * @param param1 The query parameters, including limit and cursor
   * @returns
   */
  @Security("jwt", ['admin'])
  static async GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10') // default value as fallback
    const cursor = parseInt(searchParams.get('cursor') || '0')

    if (limit > 100 || limit < 0) {
      return NextResponse.json({ error: 'Invalid fetch limit' }, { status: StatusCodes.BAD_REQUEST })
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

    return NextResponse.json({ data: combinedUserData, nextPage })
  }
}

export const GET = RouteWrapper.GET
