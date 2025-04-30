'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { BsFillPersonFill } from 'react-icons/bs'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">KIA ORA</p>
      <form>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="First Name"
            type="text"
            startIcon={<BsFillPersonFill className="text-muted-blue h-full" />}
          />
          <Input
            placeholder="Last Name"
            type="text"
            startIcon={<BsFillPersonFill className="text-muted-blue h-full" />}
          />
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
            <p className="text-xs">Register</p>
          </Button>
          <p className="text-steel-blue text-xs text-center pb-4">
            {'Already have an account? Log in '}
            <Link href="/auth/login">
              <u>here</u>
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
