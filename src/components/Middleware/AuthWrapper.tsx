import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { payloadAuthentication } from '@/business-layer/security/authentication'
import { UnauthorizedAuthError } from '@/business-layer/security/errors'

export interface AuthWrapperProps {
  children: ReactNode
  scopes?: string[]
  fallbackUrl?: string
}

export const AuthWrapper = async ({
  children,
  scopes,
  fallbackUrl = '/auth/login',
}: AuthWrapperProps) => {
  try {
    await payloadAuthentication('jwt', scopes)
    return <>{children}</>
  } catch (err) {
    if (err instanceof UnauthorizedAuthError) {
      return redirect(fallbackUrl)
    }
    console.error(err)
    return redirect('/error')
  }
}
