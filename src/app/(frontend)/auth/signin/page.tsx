'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { StatusCodes } from 'http-status-codes'
import LoginService from '@/lib/services/login/LoginService'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignIn() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setError(null)
    setIsLoading(true)

    const email = (document.getElementById('email') as HTMLInputElement)?.value || ''
    const password = (document.getElementById('password') as HTMLInputElement)?.value || ''

    console.log(email, password)

    try {
      const response = await LoginService.login({ email, password })

      if (response.status === StatusCodes.OK) {
        // Successful login - redirect to dashboard or homepage
        router.push('/dashboard')
      } else {
        // Handle error responses
        setError(response.details || response.error || response.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">WELCOME BACK</p>
      <form>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Email Address"
            type="email"
            id="email"
            required
            startIcon={<MdOutlineMail className="text-muted-blue h-full" />}
          />
          <Input
            placeholder="Password"
            type="password"
            id="password"
            required
            startIcon={<MdLock className="text-muted-blue h-full" />}
          />
          <Button
            size="md"
            variant="dark"
            type="submit"
            data-testid="login-button"
            onClick={handleLogin}
          >
            <p className="text-xs">{isLoading ? 'Logging in...' : 'Login'}</p>
          </Button>
          <p className="text-steel-blue text-xs text-center">
            {'Don\'t have an account? Sign Up '}
            <Link href="/auth/signup">
              <u>here</u>
            </Link>
          </p>
          <div>
            <div className="flex items-center w-full pt-2 pb-3">
              <div className="border-t border-steel-blue flex-grow"></div>
              <span className="mx-4 text-steel-blue text-xs">OR</span>
              <div className="border-t border-steel-blue flex-grow"></div>
            </div>
            <Button
              className="bg-white w-full"
              size="md"
              variant="outline"
              startIcon={<FcGoogle className="h-full" />}
            >
              <Link href="/" className="text-xs">
                Sign In with Google
              </Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
