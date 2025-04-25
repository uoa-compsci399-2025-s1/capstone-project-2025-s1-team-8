import React, { FC, useState } from 'react'
import Input from '../Input/InputField'

interface RadioProps {
  values: string[]
  customInput?: boolean
}

const Radio: FC<RadioProps> = ({ values, customInput = false }) => {
  const [customInputValue, setCustomInputValue] = useState('')

  return (
    <div className={`flex flex-col`}>
      {values.map((value, index) => (
        <label
          key={index}
          className="
          flex items-center mb-2 
          hover:cursor-pointer"
        >
          <input
            type="radio"
            name="radio"
            value={value}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
          />
          <span
            className="w-[16px] h-[16px] inline-flex mr-2 border-2 border-steel-blue rounded-full 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-muted-blue/80"
          >
            <div className="bg-steel-blue w-[8px] h-[8px] rounded-full self-center m-auto transition-opacity duration-300" />
          </span>
          <p className="text-sm text-dark-blue">{value}</p>
        </label>
      ))}
      {customInput && (
        <label
          className="flex items-center mb-2"
        >
          <input
            type="radio"
            name="radio"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="opacity-0 peer"
          />
          <span
            className="w-[16px] h-[16px] inline-flex mr-2 border-2 border-steel-blue rounded-full 
                [&>*]:opacity-0 peer-checked:[&>*]:opacity-100
                peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-muted-blue/80"
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
          />
        </label>
      )}
    </div>
  )
}

export default Radio
