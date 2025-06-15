import React from 'react'
import ClientCard from '@/components/Generic/ClientCard/ClientCard'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'
import { UseQueryResult } from '@tanstack/react-query'

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
  onDeleteClient: (clientId: string) => Promise<{
    error?: string
    message?: string
  }>
  updatedClient: () => void
  deletedClient: () => void
  onDeleteProject: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deletedProject: () => void
  useClientProjects: (id: string) => UseQueryResult<ProjectDetails[], Error>
}

const ClientGroup: React.FC<ClientGroupProps> = ({
  clients,
  onSave,
  onDeleteClient,
  updatedClient,
  deletedClient,
  onDeleteProject,
  deletedProject,
  useClientProjects,
}) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-beige divide-beige divide-y-2">
      {clients.map((clientInfo, index) => (
        <ClientCard
          key={clientInfo.client.id || index}
          clientInfo={clientInfo.client}
          onSave={onSave}
          onDeleteClient={onDeleteClient}
          updatedClient={updatedClient}
          deletedClient={deletedClient}
          onDeleteProject={onDeleteProject}
          deletedProject={deletedProject}
          useClientProjects={useClientProjects}
        />
      ))}
    </div>
  )
}

export default ClientGroup
