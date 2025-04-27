'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'

export default function SignIn() {
  return (
    <div className="flex flex-row justify-between items-center min-h-screen w-full">
      {/*Leftside*/}
      <div className="flex flex-col justify-center items-start pl-[10vw] min-h-screen w-6/10 bg-gradient-to-t from-[#88B8C4] via-[#A7CAD1] to-[#C6DCDE] gap-8">
        <p className="text-beige text-5xl font-bold font-silkscreen">ENCAPSULATE</p>
        <p className="text-beige text-xl">Submit your project proposal today!</p>
        <Button size="sm" variant="light">
          Read more
        </Button>
      </div>
      {/*Rightside*/}
      <div className="flex flex-col justify-center items-center min-h-screen w-4/10">
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
                <a href="/auth/signup">
                  <u>here</u>
                </a>
              </p>
              <div className="flex items-center w-full">
                <div className="border-t border-steel-blue flex-grow"></div>
                <span className="mx-4 text-steel-blue">OR</span>
                <div className="border-t border-steel-blue flex-grow"></div>
              </div>
              <Button className="bg-white" size="md" variant="outline" startIcon={<FcGoogle />}>
                Sign In with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
