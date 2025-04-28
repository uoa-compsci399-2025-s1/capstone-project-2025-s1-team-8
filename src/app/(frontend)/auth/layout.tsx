'use client'

import Button from '@/components/Generic/Button/Button'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-between items-center min-h-screen w-full">
      {/*Leftside*/}
      <div className="flex flex-col justify-between min-h-screen w-6/10 bg-gradient-to-t from-[#88B8C4] via-[#A7CAD1] to-[#C6DCDE]">
      <nav className = "pl-[2.5vw]">
        <Link href="/" className="text-dark-blue">
          <Image src="/dark-logo.png" alt="logo" width={100} height={100} />
        </Link>
        </nav>

      <div className="flex flex-col justify-center items-start pl-[10vw] gap-8">
        <p className="text-beige text-5xl font-bold font-silkscreen">ENCAPSULATE</p>
        <p className="text-beige text-xl">Submit your project proposal today!</p>
        <Link href="/">
        <Button size="sm" variant="light">
          Read more
        </Button>
        </Link>
        </div>

        <div>
        </div>
      </div>
      {/*Rightside*/}
      <div className="flex flex-col justify-center items-center min-h-screen w-4/10">
        {children}
      </div>
    </div>
  )
}
