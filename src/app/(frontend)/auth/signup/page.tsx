'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { BsFillPersonFill } from 'react-icons/bs'

export default function SignUp() {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-2xl font-bold text-dark-blue">KIA ORA</p>
      <form>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="First Name"
            type="text"
            startIcon={<BsFillPersonFill className="text-muted-blue" />}
          />
          <Input
            placeholder="Last Name"
            type="text"
            startIcon={<BsFillPersonFill className="text-muted-blue" />}
          />
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
            Already have an account? Log in
            <a href="/auth/signin">
              <u>here</u>
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
