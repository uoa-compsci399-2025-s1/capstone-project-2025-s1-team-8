import React, { ReactNode } from 'react'

interface CapsuleProps {
  children: ReactNode // Button text or content
  variant?: 'deeper' | 'muted_blue' | 'beige' | 'light_beige' | 'gradient' | 'custom' // Button variant
  className?: string // Additional classes (for custom width and custom colours)
}

const Capsule: React.FC<CapsuleProps> = ({ children, variant = 'beige', className = '' }) => {
  // Variant Classes
  const variantClasses = {
    deeper: 'bg-deeper-blue text-dark-blue',
    muted_blue: 'bg-muted-blue text-dark-blue',
    beige: 'bg-[#F8F6E9] text-dark-blue border border-muted-blue',
    light_beige: 'bg-light-beige text-dark-blue',
    gradient:
      'bg-gradient-to-r from-bright-blue/60 to-light-beige text-dark-blue border border-muted-blue',
    custom: '',
  }

  return (
    <div
      className={`px-2.5 py-1 rounded-xl text-base ${className} 
        ${variantClasses[variant]}`}
    >
      {children}
    </div>
  )
}

export default Capsule
