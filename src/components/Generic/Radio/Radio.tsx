import React, { FC, useState } from 'react'
import Input from '../Input/InputField'

interface RadioProps {
  values: string[],
  customInput?: boolean, 
}

const Radio: FC<RadioProps> = ({
  values,
  customInput = false,
}) => {
  const [customInputValue, setCustomInputValue] = useState('')

  return (
    <div className={`flex flex-col`}>
      {values.map((value, index) => (
        <label key={index} className="flex items-center mb-2">
          <input 
            type="radio" 
            name="radio" 
            value={value} 
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className="mr-2 w-[16px] h-[16px] content-[''] flex content-center rounded-full bg-white border-2 border-solid border-steel-blue checked:after:w-[10px] checked:after:h-[10px] checked:after:flex checked:after:m-auto checked:after:relative checked:after:bg-steel-blue checked:after:content-[''] checked:after:rounded-full }" 
          />
          <p className="text-steel-blue">{value}</p>
        </label>
      ))}
      {
        customInput && (
            <label className="flex items-center mb-2">
              <input 
                type="radio" 
                name="radio" 
                style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                className="mr-2 w-[16px] h-[16px] content-[''] flex content-center rounded-full bg-white border-2 border-solid border-steel-blue checked:after:w-[10px] checked:after:h-[10px] checked:after:flex checked:after:m-auto checked:after:relative checked:after:bg-steel-blue checked:after:content-[''] checked:after:rounded-full }" 
              />
              <Input
                type="text"
                placeholder={"Other"}
                className="inline text-steel-blue font-semibold"
                defaultValue={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                error={false}
              ></Input>
            </label>
        )
      }
    </div>
  )
}

export default Radio
