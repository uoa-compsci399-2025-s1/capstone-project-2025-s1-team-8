import React, { ReactNode } from 'react'

export interface DropdownOptionType {
  icon?: ReactNode
  text: string
  key: string
  hasActiveStyles: boolean
  isActive?: boolean
}

const FilterInner: React.FC<DropdownOptionType> = ({ icon, text, isActive }) => {
  return (
    <div
      className={`p-1 rounded-lg flex items-center justify-start gap-2 
        ${isActive ? 'bg-deeper-blue' : 'bg-deep-teal'} 
        hover:cursor-pointer text-xs`}
    >
      {icon && (
        <span
          className={`flex items-center 
            ${isActive ? 'text-white' : 'text-muted-blue'}`}
        >
          {icon}
        </span>
      )}
      {!icon && (
        <span className={`flex items-center`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${isActive ? 'text-white' : 'text-muted-blue'}`}
          >
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </span>
      )}
      <div className={`text-white`}>{text}</div>
    </div>
  )
}

export default FilterInner
