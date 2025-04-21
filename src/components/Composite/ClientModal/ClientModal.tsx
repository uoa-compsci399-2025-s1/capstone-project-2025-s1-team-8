import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import Modal, { ModalProps } from '@/components/Generic/Modal/Modal'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'

interface ClientModalProps extends ModalProps {
  clientFullName: string
  clientEmail: string
  affiliation: string
  introduction: string
  projects: ProjectDTOPlaceholder[]
}

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  className = '',
  clientFullName,
  clientEmail,
  affiliation,
  introduction,
  projects,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Modal open={open} onClose={onClose} className={className + ' min-h-fit'}>
      <div className="relative max-w-full flex flex-col p-15 rounded-t-2xl gap-5 pointer-events-none">
        <div className="flex flex-row gap-6">
          <h1 className="text-5xl m-0 text-dark-blue font-dm-serif-display">{clientFullName}</h1>
          <h2 className="text-2xl text-steel-blue font-inter self-end">{clientEmail}</h2>
          <button className="flex" style={{pointerEvents: "initial"}} onClick={() => handleCopy(clientEmail)}>
            {copied ? (
              <FiCheck className="self-end size-8 text-dark-blue" />
            ) : (
              <FiCopy className="self-end size-8 text-steel-blue hover:text-dark-blue cursor-pointer" />
            )}
          </button>
        </div>
        <div className="flex flex-row gap-5 items-center mb-6">
          <Capsule variant="muted_blue" text="Affiliation" />
          <Capsule variant="beige" text={affiliation} />
        </div>

        <Capsule variant="muted_blue" text="Introduction" />
        <p className="text-dark-blue font-inter text-lg whitespace-pre-wrap">{introduction}</p>
      </div>
      <div className="relative bg-muted-blue-op-45 max-w-full flex flex-col p-15 rounded-b-2xl gap-5">
        <h2 className="text-3xl text-dark-blue font-inter">Projects</h2>

        <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} projectInfo={project} />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ClientModal
