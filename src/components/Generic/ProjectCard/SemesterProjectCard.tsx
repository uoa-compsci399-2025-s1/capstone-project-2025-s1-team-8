import React from 'react'
import { ProjectDTOPlaceholder } from './ProjectCard'

const SemesterProjectCard: React.FC<ProjectDTOPlaceholder> = (projectInfo) => {
  //TODO: onclick of card, show expanded project modal

  const truncatedDescription = projectInfo.projectDescription.slice(0, 100) + '...'

  return (
    <div
      className={`relative w-full bg-light-beige rounded-lg ring-1 ring-deeper-blue p-4 overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md`}
    >
      <div className="text-left">
        <div className="relative z-10">
          <p className="text-dark-blue-1 text-lg font-bold">{projectInfo.projectName}</p>
          <p className="text-dark-blue-1">{projectInfo.client.name}</p>
          <p className="text-grey-1 py-2">{truncatedDescription}</p>
        </div>
      </div>
    </div>
  )
}

export default SemesterProjectCard
