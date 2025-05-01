'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">WELCOME BACK</p>
      <form>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Email Address"
            type="email"
            startIcon={<MdOutlineMail className="text-muted-blue h-full" />}
          />
          <Input
            placeholder="Password"
            type="password"
            startIcon={<MdLock className="text-muted-blue h-full" />}
          />
          <Button size="md" variant="dark">
            <Link href="/client">
              <p className="text-xs">Login</p>
            </Link>
          </Button>
          <p className="text-steel-blue text-xs text-center">
            {"Don't have an account? Sign up "}
            <Link href="/auth/register">
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
              <Link href="/admin" className="text-xs">
                Sign In with Google
              </Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
