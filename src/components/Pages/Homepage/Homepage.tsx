import NavBar from '@/components/Generic/NavBar/NavBar'
import Image from 'next/image'
import Button from '@/components/Generic/Button/Button'
import React from 'react'

const Homepage: React.FC = () => {
  return (
    <div className="w-full">

      <NavBar/>

      <div className="flex justify-center items-center">
        <Image src="/homepage-text.svg" alt="ENCAPSULATE" width={713} height={288}/>
      </div>

      <div className="flex justify-center items-center">
        {/* @TODO onClick() */}
        <Button variant="outline" size="sm">Submit your proposal</Button>
      </div>
    </div>
  )
}

export default Homepage