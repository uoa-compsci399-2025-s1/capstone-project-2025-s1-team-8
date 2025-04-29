import { NextRequest } from 'next/server'
import { UserCombinedInfo } from './Collections'

export type RequestWithUser = NextRequest & { user: UserCombinedInfo }
