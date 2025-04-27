'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-2xl font-bold text-dark-blue">WELCOME BACK</p>
      <form>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Email Address"
            type="email"
            startIcon={<MdOutlineMail className="text-muted-blue" />}
          />
          <Input
            placeholder="Password"
            type="password"
            startIcon={<MdLock className="text-muted-blue" />}
          />
          <Button size="md" variant="dark">
            Sign In
          </Button>
          <p className="text-steel-blue">
            {"Don't have an account? Sign Up "}
            <Link href="/auth/signup">
              <u>here</u>
            </Link>
          </p>
          <div className="flex items-center w-full">
            <div className="border-t border-steel-blue flex-grow"></div>
            <span className="mx-4 text-steel-blue">OR</span>
            <div className="border-t border-steel-blue flex-grow"></div>
          </div>
          <Button className="bg-white" size="md" variant="outline" startIcon={<FcGoogle />}>
          <Link href="/">
            Sign In with Google
          </Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
