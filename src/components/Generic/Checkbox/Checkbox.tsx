import type { FC, InputHTMLAttributes } from 'react'
import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { HiExclamation } from 'react-icons/hi'

export interface CheckboxOptions {
  value: string
  label: string
  disabled?: boolean
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  options: CheckboxOptions[]
  error?: boolean
  errorMessage?: string
}

const Checkbox: FC<CheckboxProps> = ({
  options = [],
  error = false,
  errorMessage = 'Please select at least one option',
  ...props
}) => {
  const getBorderStyle = (isDisabled: boolean) => {
    if (isDisabled) {
      return 'border-gray-500 bg-gray-100 cursor-not-allowed'
    }
    return error
      ? 'border-pink-accent hover:outline-dark-pink peer-focus:outline-dark-pink'
      : 'border-steel-blue hover:outline-deeper-blue peer-focus:outline-deeper-blue'
  }
  const getCheckboxStyle = (isDisabled: boolean) => {
    return isDisabled
      ? 'peer-checked:bg-gray-400'
      : 'peer-checked:bg-steel-blue hover:outline peer-focus:outline'
  }
  const getTextStyle = (isDisabled: boolean) => {
    return isDisabled ? 'text-gray-500' : 'text-dark-blue'
  }
  return (
    <div className={`flex flex-col`}>
      {options.map((option, index) => (
        <label
          key={index}
          className="flex mb-3"
          onClick={(e) => {
            if (option.disabled) e.preventDefault()
          }}
        >
          <input
            type="checkbox"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className={`opacity-0 peer`}
            tabIndex={option.disabled ? -1 : 0}
            value={option.value}
            {...props}
          />
          <span
            className={` ${getBorderStyle(option.disabled || false)}
                ${getCheckboxStyle(option.disabled || false)}
                min-w-[16px] h-[16px] flex mt-[3px] mr-6 border-[1.5px] rounded-sm 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                transition-colors duration-150 `}
          >
            <FiCheck className="stroke-4 w-[12px] h-[12px] text-white self-center m-auto" />
          </span>
          <p className={`w-[100%] text-sm ${getTextStyle(option.disabled || false)}`}>
            {option.label}
          </p>
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
