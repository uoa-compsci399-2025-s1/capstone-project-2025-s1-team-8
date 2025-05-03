'use server'

import { LoginRequestBodySchema } from '@/app/api/auth/login/route'
import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'
import { typeToFlattenedError } from 'zod'

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
export const handleSubmit = async (formData: FormData): Promise<void | {error?: string, message?: string, details?: typeToFlattenedError<typeof LoginRequestBodySchema>}> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email && !password) return { error: 'Email and password are required' }
  if (!email) return { error: 'Email is required' }
  if (!password) return { error: 'Password is required' }
  if (!isValidEmail(email)) return { error: 'Invalid email address' }

  const { message, status, error, details } = await UserService.login({ email, password })

  if (status === 200) {
    const { user, status } = await UserService.getCurrentUserInfo()
    if (status === 200) {
      if (user.role === 'admin') {
        redirect('/admin')
      } else if (user.role === 'client') {
        redirect('/client')
      }
    }
    redirect('/login')
  } else {
    return { error, message, details }
  }
}