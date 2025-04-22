import React, { useState } from 'react'
import Capsule from '@/components/Generic/Capsule/Capsule'
import Modal, { ModalProps } from '@/components/Generic/Modal/Modal'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import ProjectCard from '@/components/Generic/ProjectCard/ProjectCard'
import EditDropdown from '@/components/Composite/EditDropdown/EditDropdown'

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
    <Modal open={open} onClose={onClose} className={className + ' min-h-fit w-[75%] top-5'}>
      <div className="relative max-w-full flex flex-col p-15 py-19 rounded-t-2xl gap-5 pointer-events-none">
        <button
          className="absolute top-10 right-20 text-dark-blue hover:text-steel-blue cursor-pointer"
          aria-label="Edit"
          style={{ pointerEvents: 'initial' }}
        >
          <EditDropdown containerWidth={200} />
        </button>
        <div className="flex flex-row gap-5">
          <h1 className="text-4xl font-normal m-0 text-dark-blue font-dm-serif-display">
            {clientFullName}
          </h1>
          <h2 className="text-lg font-normal text-steel-blue font-inter self-end pb-0.5">
            {clientEmail}
          </h2>
          <button
            className="flex pb-1 ml-[-4px]"
            style={{ pointerEvents: 'initial' }}
            onClick={() => handleCopy(clientEmail)}
          >
            {copied ? (
              <FiCheck className="self-end size-5.5 text-dark-blue" />
            ) : (
              <FiCopy className="self-end size-5.5 text-steel-blue hover:text-dark-blue cursor-pointer" />
            )}
          </button>
        </div>
        <div className="flex flex-row gap-3 items-center mb-6">
          <Capsule variant="muted_blue" text="Affiliation" />
          <Capsule variant="beige" text={affiliation} />
        </div>

        <Capsule variant="muted_blue" text="Introduction" />
        <p className="text-dark-blue font-inter text-sm whitespace-pre-wrap">{introduction}</p>
      </div>
      <div className="relative bg-transparent-blue border-t-deeper-blue border-t max-w-full flex flex-col p-15 rounded-b-2xl gap-5">
        <h2 className="text-3xl text-dark-blue font-inter font-base pb-3 tracking-wide">
          Projects
        </h2>

        <div className="flex flex-col gap-4 overflow-x-visible overflow-y-auto max-h-[490px] p-[1px] pb-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} projectInfo={project} />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ClientModal
