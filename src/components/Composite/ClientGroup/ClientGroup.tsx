import React from 'react'
import { UserCombinedInfo } from '@/types/Collections'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'
import { Project } from '@/payload-types'

export interface ClientGroupProps {
  clients: {
    client: UserCombinedInfo
    projects?: Project[]
  }[]
}

const ClientGroup: React.FC<ClientGroupProps> = ({ clients }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {clients.map((client, index) => (
        <ClientCard key={index} {...client} />
      ))}
    </div>
  )
}

export default ClientGroup
