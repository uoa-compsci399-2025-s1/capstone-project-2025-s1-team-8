'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { handleRegister } from '@/lib/util/handleRegister'
import { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'

// still have to implement google register?

const Register = () => {
  const [errorState, setErrorState] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const submitForm = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorState(false)
    setErrorMessage('')
    const formData = new FormData(e.currentTarget)
    const res = await handleRegister(formData)

    if (res?.error) {
      console.log(res.error)
      setErrorMessage(res.error)
      setErrorState(true)
    }
  }

  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">KIA ORA</p>
      <form onSubmit={submitForm}>
        <div className="flex flex-col gap-4">
          <Input
            name="firstName"
            placeholder="First Name"
            type="firstName"
            startIcon={<BsFillPersonFill className="text-muted-blue h-full" />}
            required={true}
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            type="lastName"
            startIcon={<BsFillPersonFill className="text-muted-blue h-full" />}
            required={true}
          />
          <Input
            name="email"
            placeholder="Email Address"
            type="email"
            startIcon={<MdOutlineMail className="text-muted-blue h-full" />}
            required={true}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            startIcon={<MdLock className="text-muted-blue h-full" />}
            error={errorState}
            errorMessage={errorMessage}
            required={true}
          />
          <Button size="md" variant="dark" type="submit">
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

export default Register