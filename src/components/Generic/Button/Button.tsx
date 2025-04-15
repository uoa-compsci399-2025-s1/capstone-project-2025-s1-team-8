import React, { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode // Button text or content
  size?: 'sm' | 'md' // Button size
  variant?: 'light' | 'dark' | 'outline' | 'custom' // Button variant
  onClick?: () => void // Click handler
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string // Additional classes (for custom width and custom colours)
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'dark',
  onClick,
  className = '',
  startIcon,
  endIcon,
}) => {
  // Responsive Size Classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm',
    md: 'px-6 py-2 text-sm sm:px-8 sm:py-3 sm:text-base',
  }

  // Variant Classes
  const variantClasses = {
    light: 'bg-beige text-dark-blue-2',
    dark: 'bg-dark-blue-3 text-white',
    outline: 'text-dark-blue-2 ring-1 ring-deeper-blue',
    custom: '',
  }

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg hover:cursor-pointer ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  )
}

export default Button
