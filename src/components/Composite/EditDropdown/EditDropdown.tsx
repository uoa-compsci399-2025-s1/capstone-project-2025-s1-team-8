import React, { useState, useEffect, useRef } from 'react'
import FilterInner, { DropdownOptionType } from '@/components/Generic/Filter/FilterInner'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BsThreeDots } from 'react-icons/bs'

interface ProjectFilterProps {
  className?: string
  containerWidth?: number
  onEdit?: Function
  onDelete?: Function
}

const EditDropdownOptions: DropdownOptionType[] = [
  {
    text: 'Edit',
    icon: <FiEdit className="w-4 h-4" />,
    key: 'Edit',
    hasActiveStyles: false,
  },
  {
    text: 'Delete',
    icon: <RiDeleteBinLine className="w-4 h-4" />,
    key: 'Delete',
    hasActiveStyles: false,
  },
]

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  className,
  containerWidth = 200,
  onEdit,
  onDelete,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const newMaxWidth = containerWidth ? containerWidth / 1.5 : undefined

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className=" hover:cursor-pointer flex items-center"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <BsThreeDots className="size-4 text-dark-blue hover:text-deeper-blue pr-1" />
      </div>
      {showDropdown && (
        <div
          className={`absolute top-full right-[-1px] mt-2 z-20 max-w-44`}
          style={{ width: newMaxWidth }}
        >
          <div className={`bg-dark-blue rounded-lg flex flex-col gap-1 p-1.5 ${className}`}>
            {EditDropdownOptions.map((option, index) => (
              <div
                key={index}
                onClick={(e) => {
                  index === 1 ? onDelete?.(e) : onEdit?.(e)
                }}
                className="cursor-pointer"
              >
                <FilterInner
                  text={option.text}
                  isActive={option.isActive}
                  hasActiveStyles={option.hasActiveStyles}
                  icon={option.icon}
                  key={option.key}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectFilter
