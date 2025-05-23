import ClientModal from '@/components/Composite/ClientModal/ClientModal'
import React, { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

export interface ClientCardProps {
  clientInfo: UserCombinedInfo
  projects?: ProjectDetails[]
}

const ClientCard: React.FC<ClientCardProps> = ({ clientInfo, projects }) => {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleModal = () => {
    setOpen(!open)
  }

  return (
    <>
      <div className="bg-gradient-to-r from-denim-blue to-deeper-blue hover:from-[#35474c] hover:to-[#6d939d] w-full flex flex-row justify-between p-6">
        <div className="flex flex-row gap-4">
          <p
            className="text-light-beige font-semibold text-xl cursor-pointer"
            onClick={() => handleModal()}
          >
            {`${clientInfo.firstName}${clientInfo.lastName ? ' ' + clientInfo.lastName : ''}`}
          </p>
          <p className="text-light-beige text-base self-end">{clientInfo.email}</p>
        </div>
        <button onClick={() => handleCopy(clientInfo.email)}>
          {copied ? (
            <FiCheck className="self-center size-5 text-light-beige" />
          ) : (
            <FiCopy className="self-center size-5 text-muted-blue hover:text-light-beige cursor-pointer" />
          )}
        </button>
      </div>
      <ClientModal
        open={open}
        onClose={() => handleModal()}
        clientFullName={`${clientInfo.firstName}${clientInfo.lastName ? ' ' + clientInfo.lastName : ''}`}
        clientEmail={clientInfo.email}
        affiliation={clientInfo.affiliation ?? ''}
        introduction={clientInfo.introduction ?? ''}
        projects={projects}
      />
    </>
  )
}

export default ClientCard
