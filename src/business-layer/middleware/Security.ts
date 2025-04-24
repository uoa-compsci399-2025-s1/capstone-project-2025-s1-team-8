import { NextRequest, NextResponse } from 'next/server'
import { payloadAuthentication, UnauthorizedAuthError } from '../security/authentication'
import { StatusCodes } from 'http-status-codes'
import { UserCombinedInfo } from '@/types/Collections'

type RouteHandlerContext = {
  params: Promise<Record<string, string>> // Expect params to be a promise of a record with string keys/values
}

export function Security(securityName: string, scopes?: string[]) {
  return function (
    // eslint-disable-next-line
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: NextRequest, context: RouteHandlerContext) {
      try {
        const user = await payloadAuthentication(securityName, scopes)

        const reqWithUser = Object.assign(Object.create(Object.getPrototypeOf(req)), req, {
                user,
              }) as NextRequest & { user: UserCombinedInfo }

        return await originalMethod.call(this, reqWithUser, context)
      } catch (err) {
        console.error(err)
        if (err instanceof UnauthorizedAuthError) {
          return NextResponse.json({ error: err.message }, { status: StatusCodes.UNAUTHORIZED })
        }
        return NextResponse.json(
          { error: 'Internal Server Error' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }

    return descriptor
  }
}
