import React, { FC, ReactNode, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid'
import { LuEyeOff, LuEye } from 'react-icons/lu'

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
  required?: boolean
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
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const actualType = isPasswordType && showPassword ? 'text' : type

  const inputClasses = `${error ? 'ring-pink-2 ring-1 focus:ring-2' : 'ring-muted-blue ring-1 focus:ring-3'} ${startIcon ? 'pl-11' : ''} w-full placeholder-muted-blue text-steel-blue focus:outline-hidden rounded-lg px-4 py-2.5 text-sm bg-white ${className}`

  return (
    <>
      <div className="relative">
        {startIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5">{startIcon}</span>
        )}
        <input
          type={actualType}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
          required={required}
        />
        {isPasswordType ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-blue cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
          </button>
        ) : endIcon ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">{endIcon}</span>
        ) : null}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs text-pink-2 min-h-[1.25rem] mt-2">
          <ExclamationTriangleIcon className="w-3 h-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  )
}

export default Input
