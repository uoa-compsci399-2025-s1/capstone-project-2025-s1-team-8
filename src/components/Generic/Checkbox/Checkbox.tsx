import React, { FC } from 'react'
import { FiCheck } from "react-icons/fi";

interface CheckboxProps {
  values: string[],
  customInput?: boolean, 
}

const Checkbox: FC<CheckboxProps> = ({
  values,
}) => {

  return (
    <div className={`flex flex-col`}>
      {values.map((value, index) => (
        <label key={index} className="flex items-center mb-2">
          <input 
            type="checkbox" 
            name="checkbox" 
            value={value} 
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            className={`mr-2 w-[15px] h-[15px] content-[''] flex content-center bg-white rounded-xs border-2 border-solid border-steel-blue 
            checked:after:w-[100px] checked:after:h-[100px] checked:after:flex 
            checked:after:m-auto 
            checked:after:relative checked:after:content-[${<p>hi</p>}] 
            checked:after:bg-orange-100
            `} 
          />
          <input type="checkbox" name="checkbox" />
          <span>

          </span>
          <p className="text-steel-blue">{value}</p>
        </label>
      ))}
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="hidden peer" />
        <span
          className="w-6 h-6 inline-block mr-2 border-2 border-gray-300 rounded-sm 
                peer-checked:bg-indigo-600 peer-checked:border-indigo-600 
                peer-focus:ring-2 peer-focus:ring-indigo-300 
                transition-colors duration-150 flex-shrink-0"
        >
          <FiCheck className="w-4 h-4 text-white m-auto" />
        </span>
        <span className="select-none">Custom Checkbox</span>
      </label>
    </div>
  )
}

export default Checkbox
