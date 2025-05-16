import React, { FC, type InputHTMLAttributes } from 'react'
import { FiCheck } from 'react-icons/fi'
import { HiExclamation } from 'react-icons/hi'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  options: Array<{
    label: string
    value: string
  }>,
  error?: boolean,
  errorMessage?: string
}

const Checkbox: FC<CheckboxProps> = ({ 
  options = [],
  error = false,
  errorMessage = 'Please select at least one option',
  ...props
}) => {
  const borderErrorStyle = `${error ? 'border-pink-accent hover:outline-dark-pink peer-focus:outline-dark-pink' : 'border-steel-blue hover:outline-deeper-blue peer-focus:outline-deeper-blue'}`
  return (
    <div className={`flex flex-col`}>
      {options.map((option, index) => (
        <label key={index} className="flex mb-3">
          <input
            type="checkbox"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
            value={option.value}
            {...props}
          />
          <span
            className={` ${borderErrorStyle}
            w-[16px] h-[16px] inline-flex mt-[3px] mr-6 border-[1.5px] rounded-sm 
                peer-checked:bg-steel-blue 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                hover:outline peer-focus:outline 
                transition-colors duration-150`}
          >
            <FiCheck className="stroke-4 w-[12px] h-[12px] text-white self-center m-auto" />
          </span>
          <p className="text-sm text-dark-blue">{option.label}</p>
        </label>
      ))}
      {error && (
        <div className="flex items-center gap-2 text-xs text-pink-accent min-h-[1.25rem] mt-2">
          <HiExclamation className="w-3 h-3" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default Checkbox
