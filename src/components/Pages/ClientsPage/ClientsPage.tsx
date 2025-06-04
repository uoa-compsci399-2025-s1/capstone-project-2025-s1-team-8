'use client'
import { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'

import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

interface ClientsPageProps {
  clients: {
    client: UserCombinedInfo
    projects?: ProjectDetails[]
  }[]
  handleUpdateClient?: (
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
  handleDeleteClient?: (clientId: string) => Promise<{
    error?: string
    message?: string
  }>
  updated: () => void
  deleted: () => void
}

const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  handleUpdateClient,
  handleDeleteClient,
  updated,
  deleted,
}) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <MagnifyingGlassIcon className="text-dark-blue w-4 h-4" />
        </span>
        <input
          value={searchValue ? searchValue : ''}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search client..."
          className="pl-11 w-full placeholder-muted-blue text-dark-blue border-[1.5px] border-deeper-blue focus:outline focus:outline-deeper-blue rounded-full px-4 pt-2 pb-1.5 text-sm font-normal bg-light-beige"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <XMarkIcon
            className="text-dark-blue hover:text-deeper-blue w-4 h-4 cursor-pointer"
            onClick={() => setSearchValue('')}
          />
        </span>
      </div>
      <div className="pt-8">
        <ClientGroup
          clients={clients.filter((clientInfo) =>
            `${clientInfo.client.firstName} ${clientInfo.client.lastName ?? ''}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()),
          )}
          onSave={handleUpdateClient}
          onDelete={handleDeleteClient}
          updated={updated}
          deleted={deleted}
        />
      </div>
    </div>
  )
}

export default ClientsPage
