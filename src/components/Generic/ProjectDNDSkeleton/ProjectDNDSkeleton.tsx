import React from 'react'

const ProjectDnDSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="flex gap-4 h-full">
        {/* Rejected Container */}
        <div className="flex-1 bg-light-beige rounded-lg p-4">
          <div className="h-8 w-32 bg-deeper-blue/10 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 w-3/4 bg-deeper-blue/10 rounded mb-2" />
                <div className="h-3 w-1/2 bg-deeper-blue/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Pending Container */}
        <div className="flex-1 bg-light-beige rounded-lg p-4">
          <div className="h-8 w-32 bg-deeper-blue/10 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 w-3/4 bg-deeper-blue/10 rounded mb-2" />
                <div className="h-3 w-1/2 bg-deeper-blue/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Approved Container */}
        <div className="flex-1 bg-light-beige rounded-lg p-4">
          <div className="h-8 w-32 bg-deeper-blue/10 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 w-3/4 bg-deeper-blue/10 rounded mb-2" />
                <div className="h-3 w-1/2 bg-deeper-blue/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDnDSkeleton
