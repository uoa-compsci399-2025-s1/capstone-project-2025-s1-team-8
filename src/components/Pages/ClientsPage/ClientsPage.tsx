'use client'
import React, { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'

import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

import {
  MdOutlineNavigateNext,
  MdOutlineNavigateBefore,
  MdLastPage,
  MdFirstPage,
} from 'react-icons/md'

interface ClientsPageProps {
  clientsData: {
    client: UserCombinedInfo
    projects?: ProjectDetails[]
  }[]
  pageNum: number
  updatePageCount: (increment: boolean, firstPage?: boolean, lastPage?: boolean) => void
  totalPages?: number
  isFetching: boolean
}

const ClientsPage: React.FC<ClientsPageProps> = ({
  clientsData,
  pageNum,
  updatePageCount,
  totalPages = 0,
  isFetching
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
          clients={clientsData.filter((clientInfo) =>
            `${clientInfo.client.firstName} ${clientInfo.client.lastName ?? ''}`
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase()),
          )}
        />
      </div>
      <div className="flex flex-row justify-center items-center gap-4 mt-8">
        <button
          onClick={async () => await updatePageCount(false, true)}
          disabled={pageNum === 1 || isFetching}
          className={pageNum === 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdFirstPage size="2em" />
        </button>

        <button
          onClick={async () => await updatePageCount(false)}
          disabled={pageNum === 1 || isFetching}
          className={pageNum === 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdOutlineNavigateBefore size="2em" />
        </button>

        <p>{pageNum}</p>

        <button
          onClick={async () => await updatePageCount(true)}
          disabled={pageNum >= totalPages || isFetching}
          className={pageNum >= totalPages ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdOutlineNavigateNext size="2em" />
        </button>

        <button
          onClick={async () => await updatePageCount(true, false, true)}
          disabled={pageNum >= totalPages || isFetching}
          className={pageNum >= totalPages ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdLastPage size="2em" />
        </button>
      </div>
    </div>
  )
}

export default ClientsPage
