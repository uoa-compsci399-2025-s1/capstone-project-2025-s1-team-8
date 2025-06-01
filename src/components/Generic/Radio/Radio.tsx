import type { FC, InputHTMLAttributes } from 'react'
import React, { useState } from 'react'
import Input from '../Input/InputField'
import { HiExclamation } from 'react-icons/hi'

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string
  values: string[]
  customInput?: boolean
  className?: string
  error?: boolean
  errorMessage?: string
}

const Radio: FC<RadioProps> = ({
  id,
  values,
  customInput = false,
  className = '',
  error = false,
  errorMessage = 'Input field must not be empty',
  ...props
}) => {
  const [customValue, setCustomValue] = useState('')
  const borderErrorStyle = `${error ? 'border-pink-accent hover:outline-dark-pink peer-focus:outline-dark-pink' : 'border-steel-blue hover:outline-deeper-blue peer-focus:outline-deeper-blue'}`
  const dotErrorStyle = `${error ? 'bg-pink-accent' : 'bg-steel-blue'} w-[8px] h-[8px] rounded-full self-center m-auto transition-opacity duration-300`
  const radioStyle =
    'w-[16px] h-[16px] inline-flex mr-6 border-[1.5px] rounded-full peer-focus:outline hover:outline [&>*]:opacity-0 peer-checked:[&>*]:opacity-100'

  return (
    <div className="flex flex-col">
      {values.map((value, index) => (
        <label
          key={index}
          className={`
          flex items-center
          hover:cursor-pointer
          ${index != 0 ? 'mt-3' : ''}`}
        >
          <input
            id={id ? `${id}-${index}` : undefined}
            type="radio"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
            value={value}
            {...props}
          />
          <span className={`${radioStyle} ${borderErrorStyle} ${className}`}>
            <div className={`${dotErrorStyle}`} />
          </span>
          <p className="text-sm">{value}</p>
        </label>
      ))}
      {customInput && (
        <label className="flex items-center mt-2 mb-2">
          <input
            type="radio"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
            value={customValue}
            {...props}
          />
          <span className={`${radioStyle} ${borderErrorStyle} ${className}`}>
            <div className={`${dotErrorStyle}`} />
          </span>
          <Input
            type="text"
            placeholder={'Other'}
            className="inline h-8"
            onChange={(e) => {
              setCustomValue(e.target.value)
            }}
            error={error}
          />
        </label>
      )}
      {error && (
        <div className="flex items-center gap-2 text-xs text-pink-accent min-h-[1.25rem] mt-2">
          <HiExclamation className="w-3 h-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default Radio
