'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import Button from '@/components/Generic/Button/Button'
import React from 'react'
import Link from 'next/link'
import EncapsulateText from 'src/assets/encapsulate-text.svg'
import { handleLoginButtonClick, getLoggedInUser } from '@/lib/services/user/Handlers'
import { useEffect, useState } from 'react'
import { UserCombinedInfo } from '@/types/Collections'

const Homepage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)
  useEffect(() => {
    getLoggedInUser().then((res) => {
      setLoggedInUser(res)
      setLoginLoaded(true)
    })
  }, [])
  if (!loginLoaded) {
    return null
  }
  return (
    <div className="h-dvh flex flex-col items-center space-y-8">
      <NavBar onclick={handleLoginButtonClick} user={loggedInUser} />
      <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
        <EncapsulateText
          className="w-[300px] lg:w-[700px] md:w-[600px] sm:w-[500px] transition-all duration-300 ease-in-out
        mb-10 mt-9"
        />
        <Button variant="outline" size="md">
          <Link href="/auth/login">Submit your proposal</Link>
        </Button>
      </div>
    </div>
  )
}

export default Homepage
