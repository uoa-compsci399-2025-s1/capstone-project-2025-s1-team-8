'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import Error from '@/assets/error.svg'
import Button from '@/components/Generic/Button/Button'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import { useState } from 'react'
import type { UserCombinedInfo } from '@/types/Collections'
import { getLoggedInUser } from '@/lib/services/user/Handlers'

export default function NotFound() {
  const [loggedInUser, setLoggedInUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)

  useEffect(() => {
    getLoggedInUser().then((res) => {
      setLoggedInUser(res)
      setLoginLoaded(true)
    })
  })

  if (!loginLoaded) {
    return null
  }
  return (
    <div className="overflow-x-auto min-h-screen flex flex-col bg-[linear-gradient(to_right,rgba(255,169,222,0.2),rgba(209,251,255,0.2)),linear-gradient(to_bottom,#fffef9,#D1FBFF)]">
      <NavBar hasBg={false} onclick={handleLoginButtonClick} user={loggedInUser} />
      <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
        <div className="flex flex-col sm:flex-row items-end my-10 mx-4 sm:mx-10 md:mx-25">
          <Error className="w-[192px] h-[192px]" />
          <p className="text-deeper-blue text-5xl sm:text-[5.25rem] font-silkscreen sm:pb-8 sm:pl-5">
            ERROR
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="md">
            Return to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
