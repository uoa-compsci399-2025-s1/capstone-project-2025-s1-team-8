import React, { ReactNode } from 'react'

interface CapsuleProps {
  children: ReactNode // Button text or content
  variant?: 'deeper' | 'muted_blue' | 'beige' | 'light_beige' | 'gradient' | 'custom' // Button variant
  className?: string // Additional classes (for custom width and custom colours)
}

const Capsule: React.FC<CapsuleProps> = ({ children, variant = 'beige', className = '' }) => {
  // Variant Classes
  const variantClasses = {
    deeper: 'bg-[#88B8C4] text-[#0E4B61]',
    muted_blue: 'bg-[#C6DCDE] text-[#0E4B61]',
    beige: 'bg-[#F8F6E9] text-[#0E4B61] border-2 border-[#C6DCDE]',
    light_beige: 'bg-[#FFFEF9] text-[#0E4B61]',
    gradient:
      'bg-gradient-to-r from-[#D1FBFF57] to-[#FFFEF9] text-[#0E4B61] border-2 border-[#C6DCDE]',
    custom: '',
  }

  return (
    <div
      className={`h-auto w-fit px-2 rounded-xl text-base ${className} 
        ${variantClasses[variant]}`}
    >
      {children}
    </div>
  )
}

export default Capsule
