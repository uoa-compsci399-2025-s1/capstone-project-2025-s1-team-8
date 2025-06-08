import React from 'react'

const SemesterCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-light-beige rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-deeper-blue/10 rounded animate-pulse" />
          <div className="h-4 w-32 bg-deeper-blue/10 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-deeper-blue/10 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-deeper-blue/10 rounded animate-pulse" />
          <div className="h-6 w-32 bg-deeper-blue/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-deeper-blue/10 rounded animate-pulse" />
          <div className="h-6 w-32 bg-deeper-blue/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-deeper-blue/10 rounded animate-pulse" />
          <div className="h-6 w-32 bg-deeper-blue/10 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-deeper-blue/10 rounded animate-pulse" />
        <div className="h-8 w-24 bg-deeper-blue/10 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default SemesterCardSkeleton
