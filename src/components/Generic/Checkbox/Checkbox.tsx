import React, { FC } from 'react'
import { FiCheck } from 'react-icons/fi'

interface CheckboxProps {
  id?: string
  name?: string
  values: string[]
  required?: boolean
}

const Checkbox: FC<CheckboxProps> = ({ 
  id,
  name,
  values,
  required,
}) => {
  return (
    <div className={`flex flex-col`}>
      {values.map((value, index) => (
        <label key={index} className="flex items-center mb-2">
          <input
            id={id}
            name={name}
            type="checkbox"
            value={value}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
            required={required}
          />
          <span
            className="w-[16px] h-[16px] inline-flex mr-8 border-2 border-steel-blue rounded-sm 
                peer-checked:bg-steel-blue 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-muted-blue/80
                transition-colors duration-150"
          >
            <FiCheck className="stroke-4 w-[12px] h-[12px] text-white self-center m-auto" />
          </span>
          <span className="text-sm text-dark-blue">{value}</span>
        </label>
      ))}
    </div>
  )
}

export default Checkbox
