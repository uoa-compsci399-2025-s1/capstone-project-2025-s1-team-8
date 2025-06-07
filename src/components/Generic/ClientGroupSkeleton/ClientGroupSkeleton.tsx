import React from 'react'

const ClientGroupSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-gradient-to-r from-denim-blue to-deeper-blue w-full flex flex-row justify-between p-6 animate-pulse">
          <div className="flex flex-row gap-4">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export default ClientGroupSkeleton 