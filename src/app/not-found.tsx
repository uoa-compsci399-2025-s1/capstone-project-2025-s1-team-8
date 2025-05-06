import NavBar from '@/components/Generic/NavBar/NavBar'
import Image from 'next/image'
import Button from '@/components/Generic/Button/Button'
import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-dvh flex flex-col items-center space-y-8 bg-[linear-gradient(to_right,rgba(255,169,222,0.2),rgba(209,251,255,0.2)),linear-gradient(to_bottom,#fffef9,#D1FBFF)]">
      <NavBar />
      <div className="flex flex-1 flex-col justify-center items-center space-y-8 p-10">
        <div className="flex items-end mb-10 mr-25">
          <Image src="/error.svg" alt="error" width={192} height={192} priority />
          <p className="text-deeper-blue text-[5.25rem] font-silkscreen pb-15 pl-5">ERROR</p>
        </div>
        <Link href="/public">
          <Button variant="outline" size="md">
            Return to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
