import React from 'react'
import { FiCopy } from 'react-icons/fi'

interface BasicProjectDTOPlaceholder {
  name: string
  client: string
  description: string
}

export interface ClientDTOPlaceholder {
  name: string
  email: string
  affiliation?: string
  introduction?: string
  projects?: BasicProjectDTOPlaceholder[]
}

const ClientCard: React.FC<ClientDTOPlaceholder> = (clientInfo) => {
  return (
    <div className="bg-gradient-to-r from-denim-blue to-deeper-blue hover:from-[#35474c] hover:to-[#6d939d] w-full flex flex-row justify-between p-6">
      <div className="flex flex-row gap-4">
        <p className="text-light-beige font-semibold text-xl">{clientInfo.name}</p>
        <p className="text-light-beige text-base self-end">{clientInfo.email}</p>
      </div>
      <FiCopy className="self-center size-5 text-muted-blue hover:text-light-beige" />
    </div>
  )
}

export default ClientCard
