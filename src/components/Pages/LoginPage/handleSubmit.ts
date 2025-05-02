'use server'

import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleSubmit = async (e: FormData) => {
  const email = e.get('email') as string
  const password = e.get('password') as string
  console.log(email, password)
  if (!email && !password) return { error: 'Email and password are required' }
  if (!email) return { error: 'Email is required' }
  if (!password) return { error: 'Password is required' }
  if (!isValidEmail(email)) return { error: 'Invalid email address' }
  /*const response = await fetch('http://localhost:3000/api/auth/login', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      method: 'POST',
      mode: 'cors',
    })*/

  const { message, status, error, details } = await UserService.login({ email, password })
  //console.log(message, status, error, details)

  if (status === 200) {
    console.log('Login successful')
    redirect('/')
  } else {
    return { error, message, details }
  }
}

export default handleSubmit
