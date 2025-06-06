import type { FC, TextareaHTMLAttributes } from 'react'
import React from 'react'
import { HiExclamation } from 'react-icons/hi'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  error?: boolean
  errorMessage?: string
}

const Textarea: FC<TextareaProps> = ({
  className = '',
  error = false,
  errorMessage = 'Please fill in this text-area',
  ...props
}) => {
  const inputClasses = `${error ? 'ring-pink-accent ring-1 focus:ring-2' : 'ring-muted-blue ring-1 focus:ring-3'} w-full placeholder-muted-blue text-steel-blue focus:outline-hidden rounded-lg px-4 py-2.5 text-sm bg-white resize-none ${className}`

  return (
    <>
      <textarea className={inputClasses} {...props} />
      {error && (
        <div className="flex items-center gap-2 text-xs text-pink-accent min-h-[1.25rem] mt-2">
          <HiExclamation className="w-3 h-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  )
}

export default Textarea
