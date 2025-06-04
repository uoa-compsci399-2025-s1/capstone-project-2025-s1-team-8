import React from 'react'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

export interface ClientGroupProps {
  clients: {
    client: UserCombinedInfo
    projects?: ProjectDetails[]
  }[]
  onSave?: (
    clientId: string,
    firstName: string,
    lastName: string,
    affiliation: string,
    introduction: string,
  ) => Promise<{
    data?: UserCombinedInfo
    error?: string
    message?: string
    details?: string
  }>
  onDelete?: (clientId: string) => Promise<{
    error?: string
    message?: string
  }>
  updated: () => void
  deleted: () => void
}

const ClientGroup: React.FC<ClientGroupProps> = ({
  clients,
  onSave,
  onDelete,
  updated,
  deleted,
}) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {clients.map((clientInfo, index) => (
        <ClientCard
          key={clientInfo.client.id || index}
          clientInfo={clientInfo.client}
          projects={clientInfo.projects}
          onSave={onSave}
          onDelete={onDelete}
          updated={updated}
          deleted={deleted}
        />
      ))}
    </div>
  )
}

export default ClientGroup
