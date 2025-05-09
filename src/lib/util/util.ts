'use server'

import { LoginRequestBodySchema } from '@/app/api/auth/login/route'
import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'
import { typeToFlattenedError } from 'zod'
import ClientService from '../services/client/ClientService'
import { StatusCodes } from 'http-status-codes'
import { UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'

/**
 * This function validates the email address format
 * @param email - The email address to validate.
 * @returns whether the email address is valid or not.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * This function handles the form submission for user login.
 * It validates the input data and calls the UserService to perform the login action.
 * @param formData - The form data containing email and password.
 * @returns an object containing error messages or redirects to the appropriate page.
 */
export const handleLogin = async (
  formData: FormData,
): Promise<{
  error?: string
  message?: string
  redirect?: string
  details?: typeToFlattenedError<typeof LoginRequestBodySchema>
}> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email && !password) return { error: 'Email and password are required' }
  if (!email) return { error: 'Email is required' }
  if (!password) return { error: 'Password is required' }
  if (!isValidEmail(email)) return { error: 'Invalid email address format' }

  const { message, redirect, status, error, details } = await UserService.login({ email, password })
  if (status === 200) {
    return { message, redirect }
  } else {
    return { error, message, details }
  }
}

/**
 * Checks if user is logged in
 * @returns a boolean indicating whether the user is logged in or not.
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const res = await UserService.getCurrentUserInfo()
  return res.status === 200
}

/**
 * Handles the click event for login/logout button
 * Redirects to the appropriate page based on the login status.
 * @returns void
 */
export const handleLoginButtonClick = async (): Promise<void> => {
  const status = await isLoggedIn()
  if (status) {
    await UserService.logout()
    redirect('/')
  } else {
    redirect('/auth/login')
  }
}

export const handleClientPageLoad = async (): Promise<{
  userInfo: UserCombinedInfo
  projects: Project[]
}> => {
  const { userInfo, status } = await ClientService.getClientInfo()
  const clientProjectsRes = await ClientService.getClientProjects()

  if (status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  if (clientProjectsRes.status !== StatusCodes.OK) {
    redirect('/auth/login')
  }
  return { userInfo, projects: clientProjectsRes.projects }
}
