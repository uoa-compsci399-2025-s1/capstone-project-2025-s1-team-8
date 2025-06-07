import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import UserDataService from '@/data-layer/services/UserDataService'
import { UserRole } from '@/types/User'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * Method to fetch all users
   *
   * @param req The Next Request context
   * @param param1 The query parameters, including limit and cursor
   * @returns
   */
  @Security('jwt', ['admin'])
  static async GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10') // default value as fallback
    const page = parseInt(searchParams.get('page') || '0')
    const userRole = searchParams.get('role')
    const query = searchParams.get('query') || undefined

    if (limit > 100 || limit <= 0) {
      return NextResponse.json(
        { error: 'Invalid fetch limit' },
        { status: StatusCodes.BAD_REQUEST },
      )
    } else if (userRole && !Object.values(UserRole).includes(userRole.toLowerCase() as UserRole)) {
      return NextResponse.json(
        { error: 'Invalid role filter' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    const userDataService = new UserDataService()
    const {
      docs: rawUserData,
      nextPage,
      totalPages,
      totalDocs
    } = await userDataService.getAllUsers({
      limit,
      page,
      role: (userRole as UserRole) ?? undefined,
      query,
    })

    const combinedUserData = await Promise.all(
      rawUserData.map(async (userInfo) => {
        if (userInfo.role === UserRole.Client) {
          const { introduction, affiliation } = {
            ...(await userDataService.getClientAdditionalInfo(userInfo.id)),
          }
          return { ...userInfo, introduction, affiliation }
        }
        return userInfo
      }),
    )

    return NextResponse.json({ data: combinedUserData, nextPage, totalPages, totalDocs })
  }
}

export const GET = RouteWrapper.GET
