'use client'
import { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'

import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import { set } from 'zod'

interface ClientsPageProps {
  clients: {
    client: UserCombinedInfo
    projects?: ProjectDetails[]
  }[]
  pageNum: number
  updatePageCount: (
    increment: boolean,
  ) => Promise<{ client: UserCombinedInfo; projects?: ProjectDetails[] }[] | undefined>
  totalPages?: number
}

const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  pageNum,
  updatePageCount,
  totalPages = 0,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [clientData, setClientData] = useState(clients)

  const handleGoPreviousPage = async () => {
    const res = await updatePageCount(false)
    if (res) {
      setClientData(res)
    }
  }
  const handleGoNextPage = async () => {
    const res = await updatePageCount(true)
    if (res) {
      setClientData(res)
    }
  }

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
          clients={clientData.filter((clientInfo) =>
            `${clientInfo.client.firstName} ${clientInfo.client.lastName ?? ''}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()),
          )}
        />
      </div>
      <div className="flex flex-row justify-center items-center gap-4 mt-8">
        {pageNum !== 1 && (
          <button onClick={handleGoPreviousPage}>
            <MdOutlineNavigateBefore size={'2em'} />
          </button>
        )}
        <p>{pageNum}</p>
        {pageNum < totalPages && (
          <button>
            <MdOutlineNavigateNext size={'2em'} onClick={handleGoNextPage} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ClientsPage
