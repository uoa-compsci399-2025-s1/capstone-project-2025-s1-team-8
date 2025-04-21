import React, { ReactNode } from 'react'

interface CapsuleProps {
  text: string // Text to be displayed inside the capsule
  variant?: 'deeper' | 'muted_blue' | 'beige' | 'light_beige' | 'gradient' | 'custom' // Button variant
  className?: string // Additional classes (for custom width and custom colours)
}

const Capsule: React.FC<CapsuleProps> = ({ text, variant = 'beige', className = '' }) => {
  // Variant Classes
  const variantClasses = {
    deeper: 'bg-deeper-blue text-dark-blue',
    muted_blue: 'bg-muted-blue text-dark-blue',
    beige: 'bg-beige text-dark-blue border border-muted-blue',
    light_beige: 'bg-light-beige text-dark-blue',
    gradient:
      'bg-gradient-to-r from-bright-blue/60 to-light-beige text-dark-blue border border-muted-blue',
    custom: '',
  }

  return (
    <div
      className={`h-fit w-fit px-2.5 py-1 rounded-xl text-sm ${className} 
        ${variantClasses[variant]}`}
    >
      {text}
    </div>
  )
}

export default Capsule
