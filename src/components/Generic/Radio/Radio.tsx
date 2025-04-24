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
          text-dark-blue 
          border-steel-blue hover:border-dark-blue
          hover:cursor-pointer"
        >
          <input
            type="radio"
            name="radio"
            value={value}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="mr-2 w-[16px] h-[16px] content-[''] flex content-center rounded-full bg-white border-2 border-solid 
            after:w-[10px] after:h-[10px] after:flex after:m-auto after:relative after:bg-white after:content-[''] after:rounded-full
            checked:hover:after:bg-dark-blue 
            checked:after:bg-steel-blue
            checked:after:transition-colors checked:after:duration-300
            focus:outline-2 focus:outline-offset-1 focus:outline-muted-blue/80 "
          />
          <p>{value}</p>
        </label>
      ))}
      {customInput && (
        <label
          className="flex items-center mb-2
          text-dark-blue 
          border-steel-blue hover:border-dark-blue"
        >
          <input
            type="radio"
            name="radio"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="mr-2.5 w-[16px] h-[16px] content-[''] flex content-center rounded-full bg-white border-2 border-solid 
                  after:w-[10px] after:h-[10px] after:flex after:m-auto after:relative after:bg-white after:content-[''] after:rounded-full
                  checked:hover:after:bg-dark-blue 
                  checked:after:bg-steel-blue
                  checked:after:transition-colors checked:after:duration-300
                  focus:ring-1 focus:ring-muted-blue
                  "
          />
          <Input
            type="text"
            placeholder={'Other'}
            className="inline h-8 font-semibold"
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
