import React, { useState, useEffect, useRef } from 'react'
import FilterInner from '@/components/Generic/Filter/FilterInner'
import { useFilter } from '@/contexts/FilterContext'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
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
        <p className="text-sm font-semibold text-grey-1">Filter by</p>
        <ChevronDownIcon className="h-5 text-grey-1" />
      </div>
      {showDropdown && (
        <div
          className={`absolute top-full right-0 mt-2 z-20 max-w-40`}
          style={{ width: newMaxWidth }}
        >
          <div className={`bg-dark-blue-1 rounded-lg flex flex-col gap-2 p-2 ${className}`}>
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
