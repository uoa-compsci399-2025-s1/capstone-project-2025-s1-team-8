import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { StatusCodes } from 'http-status-codes'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  @Security('jwt', [])
  static async GET(_req: NextRequest) {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
    return NextResponse.json({ message: 'Logged out successfully' }, { status: StatusCodes.OK })
  }
}
export const GET = RouteWrapper.GET
