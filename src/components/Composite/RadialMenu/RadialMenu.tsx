'use client'

import React, { useState } from 'react'
import { useLayer } from 'react-laag'
import { FaPlus } from 'react-icons/fa'
import RadialMenuItem from '../../Generic/RadialMenuItems/RadialMenuItem'
import { AnimatePresence } from 'framer-motion'
import type { IconType } from 'react-icons'

interface RadialMenuProps {
  items: {
    Icon: IconType
    value: string
    label: string
  }[]
  onItemClick: (value: string) => void
}

const RadialMenu: React.FC<RadialMenuProps> = ({ items, onItemClick }) => {
  const [isOpen, setOpen] = useState(false)

  const { triggerProps, layerProps } = useLayer({
    isOpen,
    onOutsideClick: () => setOpen(false),
    placement: 'center',
    triggerOffset: 8,
    containerOffset: 16,
  })

  return (
    <div className="relative">
      <button
        {...triggerProps}
        onClick={() => setOpen(!isOpen)}
        className={`p-3 flex items-center justify-center transition-transform duration-200 rounded-full shadow-lg bg-gradient-to-tl from-deeper-blue to-muted-blue cursor-pointer ${
          isOpen ? 'scale-105 bg-blue-500' : 'hover:bg-blue-500'
        }`}
      >
        <FaPlus
          className={`w-5 h-5 transition-transform duration-200 text-white ${
            isOpen ? 'rotate-[-45deg]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            ref={layerProps.ref}
            className="cursor-pointer absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full w-10 h-10"
            onClick={() => setOpen(!isOpen)}
          >
            {items.map((item, index) => (
              <RadialMenuItem
                key={index}
                Icon={item.Icon}
                label={item.label}
                onClick={() => {
                  onItemClick(item.value) // call parent handler
                }}
                index={index}
                totalItems={items.length}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default RadialMenu
