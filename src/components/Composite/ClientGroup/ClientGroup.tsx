import React from 'react'
import { ClientDTOPlaceholder } from '@/components/Generic/ClientCard/ClientCard'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'

export interface ClientGroupProps {
  clients: ClientDTOPlaceholder[]
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
