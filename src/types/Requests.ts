import type { NextRequest } from 'next/server'
import type { UserCombinedInfo } from './Collections'

export type RequestWithUser = NextRequest & { user: UserCombinedInfo }
