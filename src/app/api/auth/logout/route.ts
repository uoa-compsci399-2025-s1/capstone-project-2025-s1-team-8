import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from '@/types/Auth'

export const GET = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
}
