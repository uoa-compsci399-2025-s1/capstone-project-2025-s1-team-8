import React from 'react'
import { ProjectDTOPlaceholder } from './ProjectCard'

const SemesterProjectCard: React.FC<ProjectDTOPlaceholder> = (projectInfo) => {
  //TODO: onclick of card, show expanded project modal

  const truncatedDescription = projectInfo.projectDescription.slice(0, 100) + '...'

  return (
    <div
      className={`relative w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md`}
    >
      <div className="text-left">
        <div className="relative z-10">
          <p className="text-dark-blue text-base font-bold pb-0.5">{projectInfo.projectName}</p>
          <p className="text-dark-blue text-sm">{projectInfo.client.name}</p>
          <p className="text-grey-1 py-2 text-xs">{truncatedDescription}</p>
        </div>
      </div>
    </div>
  )
}

export default SemesterProjectCard
