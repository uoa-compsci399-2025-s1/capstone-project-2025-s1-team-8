'use server'

import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'
import { typeToFlattenedError } from 'zod'
import { UserRoleWithoutAdmin } from '@/types/User'
import { RegisterRequestBodySchema } from '@/app/api/auth/register/route'
import { validateEmail } from '@/utils/validateEmail'
import { validatePassword } from '@/utils/validatePassword'

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

  if (!email) return { error: 'Email is required' }
  if (!password) return { error: 'Password is required' }
  if (!firstName) return { error: 'First name is required' }
  if (!lastName) return { error: 'Last name is required' }
  if (!validateEmail(email)) return { error: 'Invalid email address' }
  if (!validatePassword(password).isValid) {
    return { error: validatePassword(password).error }
  }

  const { message, status, error, details } = await UserService.register({
    email,
    password,
    firstName,
    lastName,
    role,
  })

  if (status === 201) {
    redirect('/login')
  } else {
    return { error, message, details }
  }
}
