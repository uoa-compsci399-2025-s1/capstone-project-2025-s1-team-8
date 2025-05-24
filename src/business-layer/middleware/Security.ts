import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import { payloadAuthentication } from '../security/authentication'
import type { UserCombinedInfo } from '@/types/Collections'
import { UnauthorizedAuthError } from '../security/errors'

type RouteHandlerContext = {
  params: Promise<Record<string, string>>
}

/**
 * The security decorator middleware method.
 *
 * @param securityName The name of the security, only JWT is supported
 * @param scopes The scopes to check for, if not provided, no scope check is performed
 * @returns Calls the original function, otherwise returns a {@link NextResponse} or redirection
 */
export function Security(securityName: 'jwt', scopes?: ('admin' | 'student' | 'client')[]) {
  return function (
    // eslint-disable-next-line
    _target: any,
    _propertyKey: string | symbol,
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
        if (err instanceof UnauthorizedAuthError) {
          return NextResponse.json({ error: err.message }, { status: StatusCodes.UNAUTHORIZED })
        }
        console.error(err)
        return NextResponse.json(
          { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }

    return descriptor
  }
}
