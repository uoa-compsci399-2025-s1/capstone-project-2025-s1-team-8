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
          <MenuButton className="inline-flex py-2 items-center gap-1 focus:outline-none nav-link-text">
            {buttonText}
            <IoChevronDown aria-hidden="true" className="size-4 text-current" />
          </MenuButton>
        </div>

        <MenuItems className="">
          {items.map((item) => (
            <div className="py-2" key={item.href}>
              <MenuItem>
                <Link href={item.href} className="nav-link-text">
                  {item.text}
                </Link>
              </MenuItem>
            </div>
          ))}
        </MenuItems>
      </Menu>

      {/* Desktop: dropdown menu */}
      <Menu as="div" className="hidden sm:relative sm:inline-block text-right">
        <div>
          <MenuButton className="inline-flex items-center gap-1 focus:outline-none nav-link-text">
            {buttonText}
            <IoChevronDown aria-hidden="true" className="size-4 text-current" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="bg-beige absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {items.map((item) => {
            return (
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
            )
          })}
        </MenuItems>
      </Menu>
    </div>
  )
}

export default NavDropdown
