import React from 'react'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'
import { UserCombinedInfo } from '@/types/Collections'
import { ProjectDetails } from '@/types/Project'

export interface ClientGroupProps {
  clients: {
    client: UserCombinedInfo
    projects?: ProjectDetails[]
  }[]
}

const ClientGroup: React.FC<ClientGroupProps> = ({ clients }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {clients.map((clientInfo, index) => (
        <ClientCard key={index} clientInfo={clientInfo.client} projects={clientInfo.projects} />
      ))}
    </div>
  )
}

export default ClientGroup
