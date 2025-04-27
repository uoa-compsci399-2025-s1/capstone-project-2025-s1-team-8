import React, { FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid'

interface InputProps {
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  error?: boolean
  errorMessage?: string
}

const Input: FC<InputProps> = ({
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = '',
  error = false,
  errorMessage = 'Please fill in this text-area',
}) => {
  const inputClasses = `${error ? 'ring-pink-2 ring-1 focus:ring-2' : 'ring-muted-blue ring-1 focus:ring-3'} w-full placeholder-muted-blue text-steel-blue focus:outline-hidden rounded-lg px-4 py-2.5 text-sm shadow bg-white resize-none ${className}`

  return (
    <>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className={inputClasses}
      />
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
