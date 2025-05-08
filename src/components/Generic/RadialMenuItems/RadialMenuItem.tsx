'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useHover, useLayer } from 'react-laag'
import React from 'react'

function getTransform(progress: number, radius: number, index: number, totalItems: number): string {
  const angle = (index / (totalItems + 5)) * 2 * Math.PI - Math.PI / 2 // Start at top
  const animatedRadius = radius * progress
  const x = -animatedRadius * Math.cos(angle)
  const y = animatedRadius * Math.sin(angle)
  const scale = progress / 2 + 0.5
  return `translate(${x}px, ${y}px) scale(${scale})`
}

type RadialMenuItemProps = {
  Icon: React.ElementType
  label: string
  index: number
  totalItems: number
  onClick: () => void
}

const RadialMenuItem: React.FC<RadialMenuItemProps> = ({
  Icon,
  label,
  index,
  totalItems,
  onClick,
}) => {
  const [isHovering, hoverProps] = useHover({ delayEnter: 300, delayLeave: 100 })

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen: isHovering,
    auto: true,
    ResizeObserver,
  })

  return (
    <div className="absolute">
      <motion.button
        {...triggerProps}
        {...hoverProps}
        className={`p-2 group flex items-center justify-center rounded-full bg-gradient-to-tl from-deeper-blue to-muted-blue cursor-pointer text-white shadow hover:shadow-lg transition`}
        onClick={onClick}
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 1, opacity: 1 }}
        exit={{ x: 0, opacity: 0 }}
        transformTemplate={({ x }) => {
          let val = 0
          if (typeof x === 'string') {
            val = parseFloat(x.replace('px', ''))
          } else if (typeof x === 'number') {
            val = x
          }
          return getTransform(val, 60, index, totalItems)
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      </motion.button>

      {renderLayer(
        <AnimatePresence>
          {isHovering && (
            <motion.div
              {...layerProps}
              className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>,
      )}
    </div>
  )
}
export default RadialMenuItem
