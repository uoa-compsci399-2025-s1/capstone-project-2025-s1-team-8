import NavBar from '@/components/Generic/NavBar/NavBar'
import Image from 'next/image'
import React from 'react'

const Homepage: React.FC = () => {
  return (
    <div className="w-full">

      <NavBar/>

      <div className="flex justify-center items-center">
        <Image src="/homepage-text.svg" alt="ENCAPSULATE" width={713} height={288}/>
      </div>

      <div className="flex justify-center items-center">
        <button type="button" className="hover:cursor-pointer">
          <Image src="/homepage-button.svg" alt="submit proposal button" width={276} height={64}/>
        </button>
      </div>
    </div>
  )
}

export default Homepage