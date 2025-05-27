'use client'

import React, { useState } from 'react'
import ProjectModal from '@/components/Composite/ProjectModal/ProjectModal'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

interface ProjectCardProps {
  projectInfo: ProjectDetails
  type?: 'student' | 'admin'
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectInfo, type = 'admin' }) => {
  const [modalOpen, setModalOpen] = useState(false)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  const truncatedDescription =
    projectInfo.description.length > 100
      ? projectInfo.description.slice(0, 100) + '...'
      : projectInfo.description

  const client = projectInfo.client as UserCombinedInfo
  const semesters = projectInfo.semesters ?? []

  return (
    <div>
      <div
        className="w-full bg-light-beige rounded-2xl ring-1 ring-deeper-blue p-5 pt-6 cursor-pointer"
        onClick={() => toggleModal()}
      >
        <div className="text-left">
          <div className="relative z-10">
            <p className="text-dark-blue text-base font-semibold pb-0.5">{`${projectInfo.number ?? ''}${projectInfo.number ? '. ' : ''}${projectInfo.name}`}</p>
            <p className="text-dark-blue text-xs">
              {`${client.firstName}${client.lastName ? ` ${client.lastName}` : ''}`}
            </p>
            <p className="text-grey-1 pt-3 pb-2 text-xs">{truncatedDescription}</p>
          </div>
        </div>
      </div>
      <ProjectModal
        projectInfo={projectInfo}
        open={modalOpen}
        onClose={() => toggleModal()}
        type={type}
        semesters={semesters}
      />
    </div>
  )
}

export default ProjectCard
