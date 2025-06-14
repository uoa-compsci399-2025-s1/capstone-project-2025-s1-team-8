'use client'
import React, { useMemo, useCallback, useState, useRef } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'
import {
  MdOutlineNavigateNext,
  MdOutlineNavigateBefore,
  MdLastPage,
  MdFirstPage,
} from 'react-icons/md'
import { useQueryState } from 'nuqs'
import { FiLoader } from 'react-icons/fi'

import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import ClientGroupSkeleton from '@/components/Generic/ClientGroupSkeleton/ClientGroupSkeleton'
import { useClients } from '@/lib/hooks/useClients'
import type { UserCombinedInfo } from '@/types/Collections'

interface ClientsPageProps {
  onUpdateClient: (
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
}

const ClientsPage: React.FC<ClientsPageProps> = ({
  onUpdateClient,
  onDeleteClient,
  updatedClient,
  deletedClient,
  onDeleteProject,
  deletedProject,
}) => {
  const [search, setSearch] = useQueryState('search')
  const [localSearch, setLocalSearch] = useState(search ?? '')
  const [isTyping, setIsTyping] = useState(false)
  const [page, setPage] = useQueryState('page', {
    defaultValue: '1',
  })
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSearch = useCallback(
    (value: string) => {
      setIsTyping(true)
      setLocalSearch(value)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        if (value !== search) {
          setSearch(value || null)
          setPage('1')
        }
      }, 500)
    },
    [search, setSearch, setPage],
  )

  const currentPage = Number(page)
  const { data, isFetching, isLoading } = useClients(currentPage, search ?? '')

  const { totalPages, totalUsers, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.max(1, data?.totalPages || 0)
    const totalUsers = Math.max(0, data?.totalUsers || 0)
    const startIndex = totalUsers > 0 ? Math.min((currentPage - 1) * 10 + 1, totalUsers) : 0
    const endIndex = Math.min(currentPage * 10, totalUsers)

    return {
      totalPages,
      totalUsers,
      startIndex,
      endIndex,
    }
  }, [data?.totalPages, data?.totalUsers, currentPage])

  const showLoading = isLoading || (isFetching && !data?.clients?.length && !isTyping)
  const hasClients = Boolean(data?.clients?.length)

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          <MagnifyingGlassIcon className="text-dark-blue w-4 h-4" />
        </span>
        <input
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search client..."
          className="pl-11 w-full placeholder-muted-blue text-dark-blue border-[1.5px] border-deeper-blue focus:outline focus:outline-deeper-blue rounded-full px-4 pt-2 pb-1.5 text-sm font-normal bg-light-beige"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-4">
          {isFetching || isTyping ? (
            <FiLoader className="text-dark-blue w-4 h-4 animate-spin" />
          ) : (
            <XMarkIcon
              className="text-dark-blue hover:text-deeper-blue w-4 h-4 cursor-pointer"
              onClick={() => handleSearch('')}
            />
          )}
        </span>
      </div>
      <div className="pt-8 relative">
        {showLoading ? (
          <ClientGroupSkeleton />
        ) : (
          <>
            <ClientGroup
              clients={data?.clients || []}
              onSave={onUpdateClient}
              onDeleteClient={onDeleteClient}
              updatedClient={updatedClient}
              deletedClient={deletedClient}
              onDeleteProject={onDeleteProject}
              deletedProject={deletedProject}
            />
          </>
        )}
      </div>
      {!hasClients && !showLoading && (
        <div className="flex justify-center mt-4">
          <p className="text-dark-blue">No Results found for {search}</p>
        </div>
      )}
      <div className="flex flex-row justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage('1')}
          disabled={currentPage === 1 || isFetching || totalPages === 0}
          className={`${currentPage === 1 || totalPages === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'} ${isFetching ? 'opacity-50' : ''}`}
        >
          <MdFirstPage size="1.5em" />
        </button>

        <button
          onClick={() => setPage((currentPage - 1).toString())}
          disabled={currentPage === 1 || isFetching || totalPages === 0}
          className={`${currentPage === 1 || totalPages === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'} ${isFetching ? 'opacity-50' : ''}`}
        >
          <MdOutlineNavigateBefore size="1.5em" />
        </button>

        <p className="text-dark-blue">
          {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setPage((currentPage + 1).toString())}
          disabled={currentPage >= totalPages || isFetching || totalPages === 0}
          className={`${currentPage >= totalPages || totalPages === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'} ${isFetching ? 'opacity-50' : ''}`}
        >
          <MdOutlineNavigateNext size="1.5em" />
        </button>

        <button
          onClick={() => setPage(totalPages.toString())}
          disabled={currentPage >= totalPages || isFetching || totalPages === 0}
          className={`${currentPage >= totalPages || totalPages === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'} ${isFetching ? 'opacity-50' : ''}`}
        >
          <MdLastPage size="1.5em" />
        </button>
      </div>
      {totalUsers > 0 && (
        <div className="flex justify-center mt-4">
          <p className="text-dark-blue">
            {startIndex} - {endIndex} of {totalUsers} results
          </p>
        </div>
      )}
    </div>
  )
}

export default ClientsPage
