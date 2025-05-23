import type { FC } from 'react'
import React from 'react'
import { FiCheck } from 'react-icons/fi'

interface CheckboxProps {
  id?: string
  name?: string
  values: string[]
  required?: boolean
}

const Checkbox: FC<CheckboxProps> = ({ id, name, values, required = false }) => {
  return (
    <div className={`flex flex-col`}>
      {values.map((value, index) => (
        <label key={index} className="flex mb-3">
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
            className="w-[16px] h-[16px] inline-flex mt-[3px] mr-6 border-[1.5px] border-steel-blue rounded-sm 
                peer-checked:bg-steel-blue 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                hover:outline hover:outline-deeper-blue
                peer-focus:outline peer-focus:outline-deeper-blue
                transition-colors duration-150"
          >
            <FiCheck className="stroke-4 w-[12px] h-[12px] text-white self-center m-auto" />
          </span>
          <p className="text-sm text-dark-blue">{value}</p>
        </label>
      ))}
    </div>
  )
}

export default Checkbox
