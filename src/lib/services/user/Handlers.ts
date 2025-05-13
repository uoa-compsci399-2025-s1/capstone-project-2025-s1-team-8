'use server'

import { redirect } from 'next/navigation'
import { typeToFlattenedError } from 'zod'

import { LoginRequestBodySchema } from '@/app/api/auth/login/route'
import UserService from './UserService'
import { RegisterRequestBodySchema } from '@/app/api/auth/register/route'
import { UserRoleWithoutAdmin } from '@/types/User'
import { isValidEmail, isValidPassword } from '@/lib/util/util'
import { UserCombinedInfo } from '@/types/Collections'

/**
 * This function handles the form submission for user login.
 * It validates the input data and calls the UserService to perform the login action.
 * @param formData - The form data containing email and password.
 * @returns an object containing error messages or redirects to the appropriate page.
 */
export async function handleLogin(formData: FormData): Promise<{
  error?: string
  message?: string
  redirect?: string
  details?: typeToFlattenedError<typeof LoginRequestBodySchema>
}> {
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
 *
 * @returns a boolean indicating whether the user is logged in or not.
 */
export async function getLoggedInUser(): Promise<UserCombinedInfo> {
  const res = await UserService.getUserSelfData()
  return res.user
}

/**
 * Handles the click event for login/logout button
 * Redirects to the appropriate page based on the login status.
 */
export async function handleLoginButtonClick() {
  const status = await getLoggedInUser()
  if (status) {
    await UserService.logout()
    redirect('/')
  } else {
    redirect('/auth/login')
  }
}

/**
 * Handles the click event for register button
 * Redirects to the appropriate page based on the login status.
 */
export const handleRegister = async (
  formData: FormData,
): Promise<void | {
  error?: string
  message?: string
  details?: typeToFlattenedError<typeof RegisterRequestBodySchema>
}> => {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = UserRoleWithoutAdmin.Client

  if (!isValidEmail(email)) return { error: 'Invalid email address' }
  if (!isValidPassword(password).isValid) {
    return { error: isValidPassword(password).error }
  }

  const { message, status, error, details } = await UserService.register({
    email,
    password,
    firstName,
    lastName,
    role,
  })

  if (status === 201) {
    redirect('/auth/login')
  } else {
    return { error, message, details }
  }
}
