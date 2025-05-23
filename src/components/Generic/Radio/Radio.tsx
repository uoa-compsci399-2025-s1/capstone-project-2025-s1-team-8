import type { FC } from 'react'
import React, { useState } from 'react'
import Input from '../Input/InputField'

interface RadioProps {
  id?: string
  name?: string
  values: string[]
  customInput?: boolean
  required?: boolean
}

const Radio: FC<RadioProps> = ({ id, name, values, customInput = false, required = false }) => {
  const [customInputValue, setCustomInputValue] = useState('')

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
            name={name}
            type="radio"
            value={value}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
            required={required}
          />
          <span
            className="w-[16px] h-[16px] inline-flex mr-6 border-[1.5px] border-steel-blue rounded-full 
                peer-focus:outline peer-focus:outline-deeper-blue
                hover:outline hover:outline-deeper-blue
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100"
          >
            <div className="bg-steel-blue w-[8px] h-[8px] rounded-full self-center m-auto transition-opacity duration-300" />
          </span>
          <p className="text-sm text-dark-blue">{value}</p>
        </label>
      ))}
      {customInput && (
        <label className="flex items-center mt-2 mb-2">
          <input
            type="radio"
            name={name}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
          />
          <span
            className="w-[16px] h-[16px] inline-flex mr-5 border-[1.5px] border-steel-blue rounded-full 
                peer-focus:outline peer-focus:outline-deeper-blue
                hover:outline hover:outline-deeper-blue
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100"
          >
            <div className="bg-steel-blue w-[8px] h-[8px] rounded-full self-center m-auto transition-opacity duration-300" />
          </span>
          <Input
            type="text"
            placeholder={'Other'}
            className="inline h-8"
            defaultValue={customInputValue}
            onChange={(e) => setCustomInputValue(e.target.value)}
            error={false}
            required={required}
          />
        </label>
      )}
    </div>
  )
}

export default Radio
