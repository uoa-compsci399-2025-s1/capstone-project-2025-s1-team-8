import React, { useState } from 'react'
import { ProjectDTOPlaceholder } from './DraggableProjectCard'
import ProjectModal from '@/components/Composite/ProjectModal/ProjectModal'

// delete once bethany's branch is merged 

export interface BasicClientDetails {
  name: string
  email: string
}

interface ProjectPlaceholder {
  projectId: string
  projectTitle: string
  projectClientDetails: BasicClientDetails
  otherClientDetails?: BasicClientDetails[]
  projectDescription: string
  desiredOutput: string
  desiredTeamSkills: string
  availableResources: string

  specialRequirements: boolean
  numberOfTeams: number
  futureConsideration: boolean
  Semesters: Array<string>
  submittedDate: Date
}

// until here

interface ProjectCardProps {
  projectInfo: ProjectPlaceholder
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectInfo }) => {
  const [modalOpen, setModalOpen] = useState(false)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  const truncatedDescription =
    projectInfo.projectDescription.length > 100
      ? projectInfo.projectDescription.slice(0, 100) + '...'
      : projectInfo.projectDescription

  return (
    <div>
      <div
        className="w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 pt-6 cursor-pointer"
        onClick={() => toggleModal()}
      >
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
      <ProjectModal {...projectInfo} open={modalOpen} onClose={() => toggleModal()}/>
    </div>
  )
}

export default ProjectCard
