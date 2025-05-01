'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import handleSubmit from './handleSubmit'
import { useState } from 'react'

const SignIn = () => {
  // const [email, setEmail] = useState<string>('')
  // const [password, setPassword] = useState<string>('')
  //const emailInputRef = useRef<HTMLInputElement>(null)
  //const passwordInputRef = useRef<HTMLInputElement>(null)
  const [errorState, setErrorState] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    //alert(formData.toString())
    const res = await handleSubmit(formData);
    if (res?.error){
      //alert(res?.error)
      setErrorMessage(res.error)
      setErrorState(true)
    }
  }

  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">WELCOME BACK</p>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            name="email"
            placeholder="Email Address"
            // ref={emailInputRef}
            type="email"
            startIcon={<MdOutlineMail className="text-muted-blue h-full" />}
            error={errorState}
            errorMessage={errorMessage}
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            startIcon={<MdLock className="text-muted-blue h-full" />}
            //value={password}
            //onChange={(e) => setPassword(e.target.value)}
            // ref={passwordInputRef}
            error={errorState}
            errorMessage={errorMessage}
            required={true}
          />
          <Button size="md" variant="dark" type="submit">
            <p className="text-xs">Login</p>
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

export default SignIn
