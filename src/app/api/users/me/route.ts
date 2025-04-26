import { Security } from '@/business-layer/middleware/Security'
import { UserCombinedInfo } from '@/types/Collections'
import { NextRequest, NextResponse } from 'next/server'

class RouteWrapper {
  /**
   * GET request to get a user's own information
   *
   * @param req The next request containing the user information
   * @returns The user's own information
   */
  @Security('jwt')
  static async GET(req: NextRequest & { user: UserCombinedInfo }) {
    const { user } = req
    return NextResponse.json({
      data: user,
    })
  }
}
export const GET = RouteWrapper.GET
