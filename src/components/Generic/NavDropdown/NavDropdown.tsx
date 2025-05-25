import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NavLink } from '../NavBar/NavBar'
import Link from 'next/link'
import React from 'react'

interface NavDropdownProps {
  children: React.ReactNode
  title?: string
  items: NavLink[]
}

const NavDropdown: React.FC<NavDropdownProps> = ({ children, items, title }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent text-dark-blue shadow-md shadow-muted-blue rounded-lg w-48">
        {title && (
          <React.Fragment>
            <DropdownMenuLabel className="text-dark-blue font-semibold">{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </React.Fragment>
        )}
        {items.map((item) => (
          <DropdownMenuItem asChild key={item.href}>
            <Link
              href={item.href}
              className="w-full px-2 py-1.5 rounded-md hover:bg-steel-blue hover:text-white focus:bg-steel-blue focus:text-white"
            >
              {item.text}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavDropdown
