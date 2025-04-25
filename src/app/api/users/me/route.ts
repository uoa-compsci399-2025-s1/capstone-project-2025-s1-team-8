import { Security } from '@/business-layer/middleware/Security'
import { UserCombinedInfo } from '@/types/Collections'
import { NextRequest, NextResponse } from 'next/server'

class RouteWrapper {
  @Security('jwt')
  static async GET(req: NextRequest & { user: UserCombinedInfo }) {
    const { user } = req
    return NextResponse.json({
      data: user,
    })
  }
}
export const GET = RouteWrapper.GET
