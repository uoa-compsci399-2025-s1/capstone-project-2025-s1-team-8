import React, { FC, ReactNode } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid'

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | string
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  min?: string
  max?: string
  step?: number
  error?: boolean
  errorMessage?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const Input: FC<InputProps> = ({
  type = 'text',
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = '',
  min,
  max,
  step,
  error = false,
  errorMessage = 'Please fill in this field',
  startIcon,
  endIcon,
}) => {
  let inputClasses = `${error ? 'ring-pink-2 ring-2' : 'ring-muted-blue ring-1'} ${startIcon ? 'pl-11' : ''} w-full placeholder-muted-blue text-dark-blue-2 focus:outline-hidden focus:ring-3 rounded-lg px-4 py-2.5 text-sm shadow bg-white ${className}`

  return (
    <div>
      <div className="relative">
        {startIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5">{startIcon}</span>
        )}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
        />
        {endIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">{endIcon}</span>
        )}
      </div>
      <div className="text-xs text-pink-2 flex gap-2 items-center h-5 py-4">
        <ExclamationTriangleIcon className="w-3 h-3" />
        <p>{errorMessage}</p>
      </div>
    </div>
  )
}

export default Input
