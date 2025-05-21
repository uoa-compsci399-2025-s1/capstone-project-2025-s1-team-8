import React, { createContext, useContext } from 'react'
import type { SortableKeys } from '@/components/Generic/Filter/ProjectFilterAssets'

type FilterContextType = {
  selectedFilter: string | undefined
  setSelectedFilter: (filter: SortableKeys) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: FilterContextType
}) => {
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
