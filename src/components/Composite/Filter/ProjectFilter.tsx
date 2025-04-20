import React, { useState, useEffect, useRef } from 'react'
import FilterInner from '@/components/Generic/Filter/FilterInner'
import { useFilter } from '@/contexts/FilterContext'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'
import {
  DefaultDropdownOptions,
  SortableKeys,
} from '@/components/Generic/Filter/ProjectFilterAssets'

interface ProjectFilterProps {
  className?: string
  containerWidth?: number
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ className, containerWidth }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const newMaxWidth = containerWidth ? containerWidth / 1.5 : undefined
  const { selectedFilter, setSelectedFilter } = useFilter()

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
        <p className="text-sm font-medium text-grey-1 pr-1">Filter By</p>
        {showDropdown ? (
          <GoChevronUp className="h-5 text-grey-1 size-4" />
        ) : (
          <GoChevronDown className="h-5 text-grey-1 size-4" />
        )}
      </div>
      {showDropdown && (
        <div
          className={`absolute top-full right-[-1px] mt-2 z-20 max-w-44`}
          style={{ width: newMaxWidth }}
        >
          <div className={`bg-dark-blue rounded-lg flex flex-col gap-1 p-1.5 ${className}`}>
            {DefaultDropdownOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  if (option.hasActiveStyles != false) {
                    setSelectedFilter(option.key as SortableKeys)
                  }
                }}
                className="cursor-pointer"
              >
                <FilterInner
                  text={option.text}
                  isActive={option.hasActiveStyles == false ? false : selectedFilter === option.key}
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
