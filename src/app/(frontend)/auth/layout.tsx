'use client'

import Button from '@/components/Generic/Button/Button'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-between items-center min-h-screen w-full">
      {/*Leftside*/}
      <div className="flex flex-col justify-center items-start pl-[10vw] min-h-screen w-6/10 bg-gradient-to-t from-[#88B8C4] via-[#A7CAD1] to-[#C6DCDE] gap-8">
        <p className="text-beige text-5xl font-bold font-silkscreen">ENCAPSULATE</p>
        <p className="text-beige text-xl">Submit your project proposal today!</p>
        <Button size="sm" variant="light">
          <Link href="/">Read more</Link>
        </Button>
      </div>
      {/*Rightside*/}
      <div className="flex flex-col justify-center items-center min-h-screen w-4/10">
        {children}
      </div>
    </div>
  )
}
