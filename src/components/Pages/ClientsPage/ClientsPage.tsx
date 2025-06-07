'use client'
import React, { useState, useMemo, useRef } from 'react'
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
  searchForClients: (searchValue: string) => void
  totalPages?: number
  totalUsersCount?: number
  isFetching: boolean
}

const ClientsPage: React.FC<ClientsPageProps> = ({
  clientsData,
  pageNum,
  updatePageCount,
  searchForClients,
  totalPages = 0,
  totalUsersCount = 0,
  isFetching,
}) => {
  const searchRef = useRef<HTMLInputElement>(null)

  function debounce(func: (searchValue: string) => void, delay: number) {
    let timeout: NodeJS.Timeout
    return function (searchValue: string) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func(searchValue)
      }, delay)
    }
  }
  const search = useMemo(() => debounce(searchForClients, 300), [searchForClients])

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <MagnifyingGlassIcon className="text-dark-blue w-4 h-4" />
        </span>
        <input
          ref={searchRef}
          onChange={async (e) => {
            await search(searchRef.current?.value || '')
          }}
          placeholder="Search client..."
          className="pl-11 w-full placeholder-muted-blue text-dark-blue border-[1.5px] border-deeper-blue focus:outline focus:outline-deeper-blue rounded-full px-4 pt-2 pb-1.5 text-sm font-normal bg-light-beige"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <XMarkIcon
            className="text-dark-blue hover:text-deeper-blue w-4 h-4 cursor-pointer"
            onClick={async () => {
              await search('')
            }}
          />
        </span>
      </div>
      <div className="pt-8">
        <ClientGroup
          clients={clientsData.filter((clientInfo) =>
            `${clientInfo.client.firstName} ${clientInfo.client.lastName ?? ''}`
              .toLowerCase()
              .includes((searchRef.current?.value || "").trim().toLowerCase()),
          )}
        />
      </div>
      {clientsData.length === 0 && (<div className="flex justify-center mt-4">
          <p className="text-dark-blue">No Results found for {searchRef.current?.value || ""}</p>
      </div>)}
      <div className="flex flex-row justify-center items-center gap-4 mt-8">
        <button
          onClick={async () => await updatePageCount(false, true)}
          disabled={pageNum === 1 || isFetching}
          className={pageNum === 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdFirstPage size="1.5em" />
        </button>

        <button
          onClick={async () => await updatePageCount(false)}
          disabled={pageNum === 1 || isFetching}
          className={pageNum === 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdOutlineNavigateBefore size="1.5em" />
        </button>

        <p className="text-dark-blue">{pageNum} of {totalPages}</p>

        <button
          onClick={async () => await updatePageCount(true)}
          disabled={pageNum >= totalPages || isFetching}
          className={pageNum >= totalPages ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdOutlineNavigateNext size="1.5em" />
        </button>

        <button
          onClick={async () => await updatePageCount(true, false, true)}
          disabled={pageNum >= totalPages || isFetching}
          className={pageNum >= totalPages ? 'opacity-30 cursor-default' : 'cursor-pointer'}
        >
          <MdLastPage size="1.5em" />
        </button>
      </div>
      {totalUsersCount !== 0 && (<div className="flex justify-center mt-4">
          <p className="text-dark-blue">{(pageNum - 1) * 10 + 1} - {pageNum === totalPages ? totalUsersCount : pageNum * 10} of {totalUsersCount} results</p>
      </div>)}
    </div>
  )
}

export default ClientsPage
