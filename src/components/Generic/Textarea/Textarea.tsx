import React, { FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid'

interface TextareaProps {
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  error?: boolean
  errorMessage?: string
}

const Textarea: FC<TextareaProps> = ({
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = '',
  error = false,
  errorMessage = 'Please fill in this text-area',
}) => {
  const inputClasses = `${error ? 'ring-pink-accent ring-1 focus:ring-2' : 'ring-muted-blue ring-1 focus:ring-3'} w-full placeholder-muted-blue text-steel-blue focus:outline-hidden rounded-lg px-4 py-2.5 text-sm bg-white resize-none ${className}`

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
        <div className="flex items-center gap-2 text-xs text-pink-accent min-h-[1.25rem]">
          <ExclamationTriangleIcon className="w-3 h-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  )
}

export default Textarea
