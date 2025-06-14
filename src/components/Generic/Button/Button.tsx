import type { ReactNode } from 'react'
import React from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode // Button text or content
  size?: 'sm' | 'md' | 'custom' // Button size
  variant?: 'light' | 'dark' | 'muted_blue' | 'outline' | 'custom' // Button variant
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string // Additional classes (for custom width and custom colours)
  type?: 'button' | 'submit' | 'reset' // Button type for form submission
  loading?: boolean // Optional loading state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'custom',
  variant = 'custom',
  className = '',
  startIcon,
  endIcon,
  type = 'button',
  loading = false,
  ...props
}) => {
  // Responsive Size Classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm',
    md: 'px-6 py-2.5 text-sm sm:px-8 sm:py-3 sm:text-base',
    custom: '',
  }

  // Variant Classes
  const variantClasses = {
    light: 'bg-beige text-steel-blue enabled:hover:bg-steel-blue enabled:hover:text-light-beige',
    dark: 'bg-steel-blue text-white enabled:hover:bg-transparent enabled:hover:text-steel-blue enabled:hover:ring-1 enabled:hover:ring-steel-blue',
    muted_blue:
      'bg-muted-blue text-dark-blue enabled:hover:bg-deeper-blue enabled:hover:text-light-beige enabled:hover:ring-1 enabled:hover:ring-deeper-blue',
    outline:
      'text-steel-blue ring-1 ring-steel-blue enabled:hover:text-light-beige enabled:hover:bg-deeper-blue enabled:hover:ring-deeper-blue',
    custom: '',
  }

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg enabled:hover:cursor-pointer ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]}`}
      type={type}
      disabled={loading}
      {...props}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  )
}

export default Button
