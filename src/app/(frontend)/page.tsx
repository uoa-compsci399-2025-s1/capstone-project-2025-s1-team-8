import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import NavBar from '@/components/Generic/NavBar/NavBar'
import Button from '@/components/Generic/Button/Button'
import EncapsulateText from 'src/assets/encapsulate-text.svg'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import type { UserCombinedInfo } from '@/types/Collections'
import ClientService from '@/lib/services/client/ClientService'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to Encapsulate - A place to connect Computer Science students with innovative projects',
}

export default async function HomePage() {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo
  return (
    <div className="h-dvh flex flex-col items-center space-y-8">
      <NavBar onclick={handleLoginButtonClick} user={user} />
      <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
        <EncapsulateText
          className="w-[300px] lg:w-[700px] md:w-[600px] sm:w-[500px] transition-all duration-300 ease-in-out
        mb-10 mt-9"
        />
        <Button variant="outline" size="md">
          <Link href={'/form'}>Submit your proposal</Link>
        </Button>
      </div>
    </div>
  )
}
