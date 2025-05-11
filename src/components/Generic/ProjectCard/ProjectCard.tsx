import React, { useState } from 'react'
import ProjectModal from '@/components/Composite/ProjectModal/ProjectModal'
import { Project, Semester } from '@/payload-types'
import { UserCombinedInfo } from '@/types/Collections'

interface ProjectCardProps {
  projectInfo: Project
  semesters: Semester[]
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectInfo, semesters }) => {
  const [modalOpen, setModalOpen] = useState(false)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  const truncatedDescription =
    projectInfo.description.length > 100
      ? projectInfo.description.slice(0, 100) + '...'
      : projectInfo.description

  const client = projectInfo.client as UserCombinedInfo

  return (
    <div>
      <div
        className="w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 pt-6 cursor-pointer"
        onClick={() => toggleModal()}
      >
        <div className="text-left">
          <div className="relative z-10">
            <p className="text-dark-blue text-base font-semibold pb-0.5">{projectInfo.name}</p>
            <p className="text-dark-blue text-xs">{client.firstName + ' ' + client.lastName}</p>
            <p className="text-grey-1 pt-3 pb-2 text-xs">{truncatedDescription}</p>
          </div>
        </div>
      </div>
      <ProjectModal projectInfo={projectInfo} semesters={semesters} open={modalOpen} onClose={() => toggleModal()} />
    </div>
  )
}

export default ProjectCard
