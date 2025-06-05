'use client'

import type { NavLink } from '../NavBar/NavBar'
import Link from 'next/link'
import React from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface NavDropdownProps {
  buttonText: string
  dropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
  items: NavLink[]
}

const NavDropdown: React.FC<NavDropdownProps> = ({
  buttonText,
  items,
  dropdownOpen = false,
  setDropdownOpen,
}) => {
  const toggleMenu = () => setDropdownOpen(!dropdownOpen)
  return (
    <div className="relative">
      {/* Mobile: render items inline */}
      <div className="md:hidden text-left" onClick={toggleMenu}>
        <div className="pb-2">
          <button className="flex flex-row justify-between w-full nav-link-text">
            {buttonText}
            {!dropdownOpen && <IoChevronDown aria-hidden="true" className="size-4 text-current" />}
            {dropdownOpen && <IoChevronUp aria-hidden="true" className="size-4 text-current" />}
          </button>
        </div>

        {dropdownOpen && (
          <div className="">
            {items.map((item) => (
              <div className="py-2 px-4" key={item.href}>
                <React.Fragment>
                  <Link href={item.href} className="nav-link-text">
                    {item.text}
                  </Link>
                </React.Fragment>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: dropdown menu */}
      <div className="hidden md:flex md:relative">
        <button onClick={toggleMenu} className="nav-link-text flex flex-row justify-center gap-2">
          {buttonText} {!dropdownOpen && <IoChevronDown className="mt-0.5" />}
          {dropdownOpen && <IoChevronUp className="mt-0.5" />}
        </button>
        {dropdownOpen && (
          <div className="bg-beige mt-2 absolute inline-block z-75 top-full right-0 w-50 rounded-lg shadow-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-text block pl-4 pr-6 py-2 text-sm text-gray-700 hover:bg-muted-blue-op-45 rounded-lg text-right"
              >
                {item.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NavDropdown
