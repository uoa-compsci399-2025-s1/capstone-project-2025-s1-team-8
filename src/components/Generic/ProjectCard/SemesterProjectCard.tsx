import React from 'react'
import { ProjectDTOPlaceholder } from './ProjectCard'

interface SemesterProjectCardProps {
  projectInfo: ProjectDTOPlaceholder
}

const SemesterProjectCard: React.FC<SemesterProjectCardProps> = ({ projectInfo }) => {
  //TODO: onclick of card, show expanded project modal

  const truncatedDescription = projectInfo.projectDescription.slice(0, 100) + '...'

  return (
    <div className={`w-full bg-light-beige rounded-lg ring-1 ring-deeper-blue p-4 cursor-pointer`}>
      <div className="text-left">
        <p className="text-dark-blue-1 text-md font-bold">{projectInfo.projectName}</p>
        <p className="text-dark-blue-1 text-sm">{projectInfo.client.name}</p>
        <p className="text-grey-1 py-2 text-sm">{truncatedDescription}</p>
      </div>
    </div>
  )
}

export default SemesterProjectCard
