import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import type { NavLink } from '../NavBar/NavBar'
import Link from 'next/link'
import React from 'react'
import { IoChevronDown } from 'react-icons/io5'

interface NavDropdownProps {
  buttonText: string
  items: NavLink[]
}

const NavDropdown: React.FC<NavDropdownProps> = ({ buttonText, items }) => {
  return (
    <div className="relative">
      {/* Mobile: render items inline */}
    <Menu as="div" className="sm:hidden inline-block text-left">
        <div>
          <MenuButton className="inline-flex py-2 items-center gap-1 bg-inherit focus:outline-none nav-link-text">
            {buttonText}
            <IoChevronDown aria-hidden="true" className="size-4 text-current" />
          </MenuButton>
        </div>

        <MenuItems
          className=""
        >
          {items.map((item) => (
            <div className="py-2" key={item.href}>
              <MenuItem>
                <Link
                  href={item.href}
                  className="nav-link-text"
                >
                  {item.text}
                </Link>
              </MenuItem>
            </div>
          ))}
        </MenuItems>
      </Menu>

      {/* Desktop: dropdown menu */}
      <Menu as="div" className="hidden sm:inline-block text-left">
        <div>
          <MenuButton className="inline-flex items-center gap-1 bg-inherit focus:outline-none nav-link-text">
            {buttonText}
            <IoChevronDown aria-hidden="true" className="size-4 text-current" />
          </MenuButton>
        </div>

        <MenuItems
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-inherit rounded-md shadow-lg ring-1 ring-black/5 transition focus:outline-none"
        >
          {items.map((item) => (
            <div className="py-1" key={item.href}>
              <MenuItem>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm text-steel-blue data-focus:bg-steel-blue data-focus:text-beige data-focus:outline-hidden nav-link-text"
                >
                  {item.text}
                </Link>
              </MenuItem>
            </div>
          ))}
        </MenuItems>
      </Menu>
    </div>
  )
}

export default NavDropdown
