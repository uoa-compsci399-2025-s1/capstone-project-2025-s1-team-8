import React from 'react'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'
import { UserCombinedInfo } from '@/types/Collections'

export interface ClientGroupProps {
  clients: UserCombinedInfo []
}

const ClientGroup: React.FC<ClientGroupProps> = ({ clients }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {clients.map((client, index) => (
        <ClientCard key={index} clientInfo={client}  />
      ))}
    </div>
  )
}

export default ClientGroup
