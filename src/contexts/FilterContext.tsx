import React, { createContext, useContext, useState } from 'react'
import { SortableKeys } from '@/components/Generic/Filter/ProjectFilterAssets'

type FilterContextType = {
  selectedFilter: string
  setSelectedFilter: (filter: SortableKeys) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFilter, setSelectedFilter] = useState<SortableKeys>('submissionDate')

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
