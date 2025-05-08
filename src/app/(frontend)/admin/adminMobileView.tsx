'use client'

import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { BsFillPersonFill } from 'react-icons/bs'
import Link from 'next/link'
import NavBar from '@/components/Generic/NavBar/NavBar'
import SwitchDesktop from 'src/assets/switch-desktop.svg'

export default function AdminMobileView() {
  return (
    <div className="h-dvh flex flex-col items-center space-y-8">
      <NavBar/>
      <div className="px-6 w-screen h-screen py-6">
        <div className="px-3 mt-32 rounded-2xl
        flex-1 flex-col flex items-center justify-center
        border border-gray-300
        bg-[linear-gradient(to_right,rgba(255,169,222,0.25),rgba(209,251,255,0.2)),linear-gradient(to_bottom,#fffef9,#D1FBFF)]">
          <SwitchDesktop className="pt-5 pb-5"/>
          <div className="space-y-6 pb-15 px-6">
            <p className="text-2xl font-dm-serif-display text-dark-blue">Please switch to a desktop device</p>
            <p className="text-xs font-inter text-dark-blue">The current device is not supported for the admin dashboard. </p>
          </div>
        </div>
      </div>
    </div>
  )
}

