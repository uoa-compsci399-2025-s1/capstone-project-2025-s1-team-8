import NavBar from '@/components/Generic/NavBar/NavBar'
import Image from 'next/image'
import Button from '@/components/Generic/Button/Button'
import React from 'react'

const Homepage: React.FC = () => {
  return (
    <div className="h-dvh flex flex-col items-center space-y-8">
      <NavBar />
      <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
        <Image src="/homepage-text.svg" alt="ENCAPSULATE" width={713} height={288} priority />
        <Button variant="outline" size="sm">
          Submit your proposal
        </Button>
      </div>
    </div>
  )
}

export default Homepage
