'use server'

import { redirect } from 'next/navigation'
import ClientService from '../services/client/ClientService'
import { StatusCodes } from 'http-status-codes'
import { UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'

/**
 * This function uses the RFC2822 email validator to test for email formats
 * https://www.rfc-editor.org/rfc/rfc2822.html#section-3.4.1
 *
 * @param email - The email address to validate.
 * @returns whether the email address is valid or not.
 */
export const isValidEmail = async(email: string): Promise<boolean> => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(
    email,
  )
}

export const handleClientPageLoad = async (): Promise<{
  userInfo: UserCombinedInfo
  projects: Project[]
}> => {
  const { userInfo, status } = await ClientService.getClientInfo()
  const clientProjectsRes = await ClientService.getClientProjects()
  console.log(userInfo)

  if (status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  if (clientProjectsRes.status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  return { userInfo, projects: clientProjectsRes.projects }
}
