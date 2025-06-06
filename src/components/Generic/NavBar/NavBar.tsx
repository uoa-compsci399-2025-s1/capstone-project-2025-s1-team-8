'use client'

import React, { memo, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { UserCombinedInfo } from '@/types/Collections'
import type { User } from '@/payload-types'
import { UserRole } from '@/types/User'
import NavDropdown from '../NavDropdown/NavDropdown'

export interface NavLink {
  href: string
  text: string
}

interface NavBarProps {
  navElements?: NavLink[]
  hasBg?: boolean
  user?: UserCombinedInfo | User
  onclick?: () => void
}

const NavBar: React.FC<NavBarProps> = memo(({ navElements, hasBg = true, user, onclick }) => {
  const dashboardLink = user
    ? user.role === UserRole.Admin
      ? '/admin'
      : user.role === UserRole.Client
        ? '/client'
        : '/student'
    : '/'

  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [hasShadow, setHasShadow] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <nav
        className={`py-2 px-[5%] pr-[8%] fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${
          hasBg ? 'bg-beige/90' : ''
        } ${hasShadow ? 'shadow-md shadow-muted-blue' : ''}`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-dark-blue">
            <Image src="/dark-logo.png" alt="logo" width={100} height={100} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-15">
            {navElements?.map((navElement, index) => (
              <div key={index} className="relative group p-2">
                <Link href={navElement.href} className="nav-link-text">
                  {navElement.text}
                </Link>
                <span
                  className={`nav-link-text-underline scale-x-0 group-hover:scale-x-100 ${pathname === navElement.href ? 'scale-x-100' : ''}`}
                />
              </div>
            ))}
            {user && user.role !== UserRole.Admin && (
              <div className="relative group p-2">
                <Link href={dashboardLink} className="nav-link-text">
                  {'My Dashboard'}
                </Link>
                <span
                  className={`nav-link-text-underline scale-x-0 group-hover:scale-x-100 ${pathname === dashboardLink ? 'scale-x-100' : ''}`}
                />
              </div>
            )}
            {user && user.role === UserRole.Admin && (
              <div className="relative group p-2 flex items-center">
                <NavDropdown
                  items={[
                    { href: '/admin', text: 'Admin Dashboard' },
                    { href: '/client', text: 'Client Dashboard' },
                    { href: '/student', text: 'Student Dashboard' },
                  ]}
                  buttonText="My Dashboards"
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                />

                <span
                  className={`nav-link-text-underline scale-x-0 group-hover:scale-x-100 ${dropdownOpen ? 'scale-x-100' : ''}`}
                />
              </div>
            )}
            <div className="relative group p-2">
              {
                <button onClick={onclick} className="nav-link-text font-bold">
                  {user ? 'Logout' : 'Login'}
                </button>
              }
              <span
                className={`nav-link-text-underline scale-x-0 group-hover:scale-x-100  ${pathname === '/auth/login' ? 'scale-x-100' : ''}`}
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
          className={`md:hidden overflow-hidden fixed mt-[100px] px-5 top-0 left-0 w-screen transition-all duration-300 ease-in-out z-50 ${
            isOpen
              ? 'max-h-96 opacity-100 py-4 mt-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]'
              : 'max-h-0 opacity-0 py-0'
          }
        ${hasBg ? 'bg-beige/90' : ''}`}
        >
          {navElements?.map((navElement, index) => (
            <div key={index} className="p-[5%]">
              {/* {navElement} */}
              <Link href={navElement.href} className="nav-link-text">
                {navElement.text}
              </Link>
            </div>
          ))}
          {user && user.role !== UserRole.Admin && (
            <div className="p-[5%]">
              <Link href={dashboardLink} className="nav-link-text">
                {'My Dashboard'}
              </Link>
            </div>
          )}
          {user && user.role === UserRole.Admin && (
            <div className="p-[5%]">
              <NavDropdown
                items={[
                  { href: '/admin', text: 'Admin Dashboard' },
                  { href: '/client', text: 'Client Dashboard' },
                  { href: '/student', text: 'Student Dashboard' },
                ]}
                buttonText="My Dashboards"
                setDropdownOpen={setDropdownOpen}
                dropdownOpen={dropdownOpen}
              ></NavDropdown>
            </div>
          )}
          <div className="p-[5%]">
            {
              <button onClick={onclick} className="nav-link-text font-bold">
                {user ? 'Logout' : 'Login'}
              </button>
            }
          </div>
        </div>
      </nav>
    </div>
  )
})

NavBar.displayName = 'NavBar'

export default NavBar
