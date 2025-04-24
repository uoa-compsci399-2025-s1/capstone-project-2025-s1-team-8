import { PlaceholderProjectDetailsType } from '@/types/Project'
import React from 'react'

interface ProjectCardProps {
  projectInfo: PlaceholderProjectDetailsType
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectInfo }) => {
  //TODO: onclick of card, show expanded project modal

  const truncatedDescription = projectInfo.projectDescription.slice(0, 100) + '...'

  return (
    <div className="w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 pt-6 cursor-pointer">
      <div className="text-left">
        <div className="relative z-10">
          <p className="text-dark-blue text-base font-semibold pb-0.5">
            {projectInfo.projectTitle}
          </p>
          <p className="text-dark-blue text-xs">{projectInfo.projectClientDetails.name}</p>
          <p className="text-grey-1 pt-3 pb-2 text-xs">{truncatedDescription}</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
