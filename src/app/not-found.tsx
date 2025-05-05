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
        <div className="flex items-end">
          <Image src="/error.svg" alt="error" width={160} height={160} priority />
          <p className="text-error-color text-7xl font-silkscreen pb-4">ERROR</p>
        </div>
        <Button variant="outline" size="md">
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </div>
  )
}
