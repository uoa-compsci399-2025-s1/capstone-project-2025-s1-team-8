'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { Semester } from '@/payload-types'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'
import {
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
  handlePublishChanges,
  updateProjectOrdersAndStatus,
  handleGetAllSemesters,
  getAllClients,
  handleGetAllSemesterProjects,
} from '@/lib/services/admin/Handlers'
import SemestersPage from '../SemestersPage/SemestersPage'
import ClientsPage from '../ClientsPage/ClientsPage'
import Notification from '@/components/Generic/Notification/Notification'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'

type AdminDashboardProps = {
  clients: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  semesters: Semester[]
  projects: SemesterContainerData
  totalNumPages?: number
  semesterStatusList?: Record<string, 'current' | 'upcoming' | ''>
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clients,
  semesters: initialSemesters,
  projects,
  totalNumPages = 0,
  semesterStatusList = {},
}) => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']
  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters)
  const [semesterStatuses, setSemesterStatuses] =
    useState<Record<string, 'current' | 'upcoming' | ''>>(semesterStatusList)
  const [clientsData, setClientsData] = useState(clients)
  const [pageNum, setPageNum] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(totalNumPages)
  const cachedClientSearchRef = useRef<
    Record<
      string,
      { data: { client: UserCombinedInfo; projects: ProjectDetails[] }[]; totalPages: number }
    >
  >({ _1: { data: clients, totalPages: totalNumPages } })
  const itemsPerPage = 10

  const getClientsCache = async (pageNum: number, query: string) => {
    if (`${query}_${pageNum}` in cachedClientSearchRef.current) {
      setClientsData(cachedClientSearchRef.current[`${query}_${pageNum}`].data || [])
      console.log('Using cached data for query:', query, 'page:', pageNum)
      return
    }
    const res = await getAllClients({ limit: itemsPerPage, page: pageNum, query })
    cachedClientSearchRef.current[`${query}_${pageNum}`] = {
      data: res?.data || [],
      totalPages: res?.totalPages || 0,
    }
    console.log('Fetched new data for query:', query, 'page:', pageNum)
    setClientsData(res?.data || [])
  }

  const searchForClients = async (searchValue: string) => {
    const query = searchValue.trim().toLowerCase()
    if (`${query}_1` in cachedClientSearchRef.current) {
      console.log('Using cached data for query:', query)
      setClientsData(cachedClientSearchRef.current[`${query}_1`].data)
      setPageNum(1)
      setTotalPages(cachedClientSearchRef.current[`${query}_1`].totalPages)
      return
    }
    const res = await getAllClients({ limit: itemsPerPage, page: 1, query })
    setClientsData(res?.data || [])
    setPageNum(1)
    if (res?.totalPages) {
      setTotalPages(res.totalPages)
    } else {
      setTotalPages(0)
    }
    console.log('searchForClients', 'query:', query)
    cachedClientSearchRef.current[`${query}_1`] = {
      data: res?.data || [],
      totalPages: res?.totalPages || 0,
    }
  }

  const updatePageCount = async (
    increment: boolean,
    firstPage: boolean = false,
    lastPage: boolean = false,
    searchValue: string = '',
  ) => {
    try {
      if (isFetching) return
      setIsFetching(true)
      const query = searchValue.trim().toLowerCase()
      if (firstPage) {
        if (totalPages === 0 || pageNum === 1) {
          return
        }
        setPageNum(1)
        return await getClientsCache(1, query)
      }
      if (lastPage) {
        if (totalPages === 0 || pageNum === totalPages) {
          return
        }
        setPageNum(totalPages)
        return await getClientsCache(totalPages, query)
      }
      if (increment) {
        if (pageNum < totalPages) {
          await getClientsCache(pageNum + 1, query)
          return setPageNum(pageNum + 1)
        }
      } else {
        if (pageNum > 1) {
          await getClientsCache(pageNum - 1, query)
          return setPageNum(pageNum - 1)
        }
      }
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('adminNav')
    setActiveNav(saved !== null ? Number(saved) : 0)
  }, [])

  useEffect(() => {
    if (activeNav !== null) {
      localStorage.setItem('adminNav', String(activeNav))
    }
  }, [activeNav])

  const refreshSemesters = async () => {
    const res = await handleGetAllSemesters()
    if (res?.data) {
      setSemesters(res.data)
    }
    if (res?.semesterStatuses) {
      setSemesterStatuses(res.semesterStatuses)
    }
  }

  if (activeNav === null) return null // Wait for nav to be loaded

  return (
    <>
      <div className="hidden lg:block w-full">
        <div className="fixed top-6 right-6 z-50">
          <Notification
            isVisible={notificationMessage !== ''}
            title={'Success'}
            message={notificationMessage}
            onClose={() => setNotificationMessage('')}
          />
        </div>

        <div className="mt-25 w-full flex justify-center items-center gap-25 bg-beige pb-7">
          {AdminNavElements.map((nav, i) => (
            <button
              key={nav}
              onClick={() => setActiveNav(i)}
              className="relative group p-2 nav-link-text"
            >
              <p>{nav}</p>
              <span
                className={`
                    nav-link-text-underline
                    scale-x-0 group-hover:scale-x-100
                    ${activeNav === i ? 'scale-x-100' : ''}
                  `}
              />
            </button>
          ))}
        </div>

        <div className="py-4 relative min-h-[300px]">
          <div className="flex flex-col overflow-hidden w-full">
            <motion.div
              className="flex flex-1 min-h-0 [direction:ltr]"
              transition={{
                tension: 190,
                friction: 200,
                mass: 0.4,
              }}
              initial={false}
              animate={{ x: activeNav * -100 + '%' }}
            >
              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 0}
                tabIndex={activeNav === 0 ? 0 : -1}
              >
                <ProjectDnD
                  {...projects}
                  onSaveChanges={updateProjectOrdersAndStatus}
                  onPublishChanges={handlePublishChanges}
                />
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 1}
                tabIndex={activeNav === 1 ? 0 : -1}
              >
                <ClientsPage
                  clientsData={clientsData}
                  pageNum={pageNum}
                  updatePageCount={updatePageCount}
                  searchForClients={searchForClients}
                  totalPages={totalPages}
                  isFetching={isFetching}
                />
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 2}
                tabIndex={activeNav === 2 ? 0 : -1}
              >
                <SemestersPage
                  semesters={semesters}
                  created={async () => {
                    await refreshSemesters()
                    setNotificationMessage('Semester created successfully')
                  }}
                  updated={async () => {
                    await refreshSemesters()
                    setNotificationMessage('Semester updated successfully')
                  }}
                  deleted={async () => {
                    await refreshSemesters()
                    setNotificationMessage('Semester deleted successfully')
                  }}
                  handleCreateSemester={handleCreateSemester}
                  handleUpdateSemester={handleUpdateSemester}
                  handleDeleteSemester={handleDeleteSemester}
                  handleGetAllSemesterProjects = {handleGetAllSemesterProjects}
                  semesterStatuses={semesterStatuses}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <TeapotCard
        title={'Please switch to a desktop device'}
        description="The current device is not supported for the admin dashboard."
        className="lg:hidden pt-30"
      />
    </>
  )
}
export default AdminDashboard
