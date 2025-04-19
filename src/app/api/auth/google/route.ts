import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const GET = async () => {
  const state = crypto.randomUUID().toString()
  const cookieStore = await cookies()
  // Set state to prevent CSRF attacks
  cookieStore.set('state', state, {
    sameSite: 'strict',
    /**
     * Should be set at less than 10 minutes but for security, best for 60 seconds or less
     * https://www.oauth.com/oauth2-servers/authorization/the-authorization-response/
     */
    maxAge: 60,
  })

  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: googleAuthScopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Set state for CSRF attack prevention
    state,
  })
  return redirect(authorizationUrl)
}
