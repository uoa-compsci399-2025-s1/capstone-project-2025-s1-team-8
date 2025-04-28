'use client'

import Button from '@/components/Generic/Button/Button'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-center lg:justify-between items-center min-h-screen w-full bg-gradient-to-t from-[#88B8C4] via-[#A7CAD1] to-[#C6DCDE]">
      <nav className="py-2 px-[5%] pr-[8%] fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-start">
          <Link href="/" className="text-dark-blue">
            <Image src="/dark-logo.png" alt="logo" width={100} height={100} />
          </Link>
        </div>
      </nav>
      {/*Leftside*/}
      <div className="hidden lg:flex flex-col justify-center min-h-screen w-6/10">
        <div className="flex flex-col justify-center items-start pl-[10vw] gap-8">
          <p className="text-beige text-5xl font-bold font-silkscreen">ENCAPSULATE</p>
          <p className="text-beige text-xl">Submit your project proposal today!</p>
          <Link href="/">
            <Button size="sm" variant="light">
              Read more
            </Button>
          </Link>
        </div>
      </div>
      {/*Rightside*/}
      <div className="flex flex-col justify-center items-center min-h-screen min-w-1 lg:w-4/10 bg-beige">
        {children}
      </div>
    </div>
  )
}
