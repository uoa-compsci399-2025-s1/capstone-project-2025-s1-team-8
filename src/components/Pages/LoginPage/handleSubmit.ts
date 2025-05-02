'use server'

import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const handleSubmit = async (e: FormData) => {
  const email = e.get('email') as string
  const password = e.get('password') as string

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

export const handlePagePermissions = async () => {
  const { user, status } = await UserService.getCurrentUserInfo()
  if (status === 200) {
    if (user.role === 'admin') {
      redirect('/admin')
    } else if (user.role === 'client') {
      redirect('/client')
    }
  }
  return { error: 'Unauthorized' }
}
