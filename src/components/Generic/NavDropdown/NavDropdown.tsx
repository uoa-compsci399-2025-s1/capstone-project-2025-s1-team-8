'use client'

import type { NavLink } from '../NavBar/NavBar'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface NavDropdownProps {
  buttonText: string
  items: NavLink[]
}

const NavDropdown: React.FC<NavDropdownProps> = ({ buttonText, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  return (
    <div className="relative">
      {/* Mobile: render items inline */}
      <div className="md:hidden text-left" onClick={toggleMenu}>
        <div className="pb-2">
          <button className="flex flex-row justify-between w-full nav-link-text">
            {buttonText}
            {!isOpen && <IoChevronDown aria-hidden="true" className="size-4 text-current" />}
            {isOpen && <IoChevronUp aria-hidden="true" className="size-4 text-current" />}
          </button>
        </div>

        {isOpen && (
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
        <div className="relative group p-2">
          <button
            onClick={toggleMenu}
            className="nav-link-text flex flex-row justify-center gap-2 mt-1"
          >
            {buttonText} {!isOpen && <IoChevronDown className="mt-0.5" />}
            {isOpen && <IoChevronUp className="mt-0.5" />}
          </button>
          {!isOpen && (
            <span className={`nav-link-text-underline scale-x-0 group-hover:scale-x-100`} />
          )}
        </div>
        {isOpen && (
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
