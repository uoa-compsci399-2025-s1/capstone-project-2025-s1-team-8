'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface NavLink {
  href: string
  text: string
}

interface NavBarProps {
  navElements?: NavLink[]
}

const NavBar: React.FC<NavBarProps> = ({ navElements }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="py-2 px-10 fixed top-0 left-0 w-full z-50 bg-beige">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-dark-blue">
          <Image src="/dark-logo.png" alt="logo" width={100} height={100} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-20">
          {navElements?.map((navElement, index) => (
            <div key={index} className="relative group p-2">
              <Link href={navElement.href} className={`nav-link-text`}>
                {navElement.text}
              </Link>
              <span
                className={`nav-link-text-underline ${pathname === navElement.href ? 'scale-x-100' : ''}`}
              />
            </div>
          ))}
          {/* TODO: add link to About page */}
          <div className="relative group p-2">
            <Link href="/" className={`nav-link-text`}>
              About
            </Link>
            <span className={`nav-link-text-underline ${pathname === '/' ? 'scale-x-100' : ''}`} />
          </div>
          <div className="relative group p-2">
            <Link href="/auth/signin" className={`nav-link-text font-bold`}>
              Login
            </Link>
            <span
              className={`nav-link-text-underline ${pathname === '/auth/signin' ? 'scale-x-100' : ''}`}
            />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-dark-blue hover:text-muted-blue focus:outline-none transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden fixed mt-16 p-5 top-0 left-0 w-screen transition-all duration-300 ease-in-out bg-beige z-50 ${
          isOpen
            ? 'max-h-96 opacity-100 py-4 mt-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]'
            : 'max-h-0 opacity-0 py-0'
        }`}
      >
        {navElements?.map((navElement, index) => (
          <div key={index} className={`p-2`}>
            {/* {navElement} */}
            <Link href={navElement.href} className={`nav-link-text`}>
              {navElement.text}
            </Link>
          </div>
        ))}
        <div className="p-2">
          <Link href="/" className="nav-link-text">
            About
          </Link>
        </div>
        <div className="p-2">
          <Link href="/auth/signin" className="nav-link-text font-bold">
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
