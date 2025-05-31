'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { Semester } from '@/payload-types'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'
import {
  isCurrentOrUpcoming,
  handleGetAllSemesterProjects,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
  handlePublishChanges,
  updateProjectOrdersAndStatus,
  handleGetAllSemesters,
  getAllClients,
} from '@/lib/services/admin/Handlers'
import SemestersPage from '../SemestersPage/SemestersPage'
import ClientsPage from '../ClientsPage/ClientsPage'
import Notification from '@/components/Generic/Notification/Notification'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'
import { useSearchParams } from 'next/navigation'

type AdminDashboardProps = {
  clients: { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  semesters: Semester[]
  projects: SemesterContainerData
  totalPages?: number
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clients,
  semesters: initialSemesters,
  projects,
  totalPages = 0,
}) => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const searchParams = useSearchParams()
  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters)
  const [clientsData, setClientsData] = useState(clients)
  //const [pageNum, setPageNum] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const itemsPerPage = 10

  const updatePageCount = async (
    increment: boolean,
    firstPage: boolean = false,
    lastPage: boolean = false,
  ) => {
    const pageParam = searchParams.get('page')
    const parsed = pageParam ? parseInt(pageParam, 10) : 1
    let pageNum;
    if (isNaN(parsed)) {
      pageNum = 1
    } else{
      pageNum = parsed
    }

    try {
      if (isFetching) return
      setIsFetching(true)
      if (firstPage) {
        if (totalPages === 0 || pageNum === 1) {
          return
        }
        //setPageNum(1)
        const res = await getAllClients({ limit: itemsPerPage, cursor: 1 })
        setClientsData(res?.data || [])
        return
      }
      if (lastPage) {
        if (totalPages === 0 || pageNum === totalPages) {
          return
        }
        //setPageNum(totalPages)
        const res = await getAllClients({ limit: itemsPerPage, cursor: totalPages })
        setClientsData(res?.data || [])
        return
      }
      if (increment) {
        if (pageNum < totalPages) {
          const res = await getAllClients({ limit: itemsPerPage, cursor: pageNum + 1 })
          //setPageNum(pageNum + 1)
          setClientsData(res?.data || [])
          //return clientsData
        }
      } else {
        if (pageNum > 1) {
          const res = await getAllClients({ limit: itemsPerPage, cursor: pageNum - 1 })
          //setPageNum(pageNum - 1)
          setClientsData(res?.data || [])
          //return clientsData
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
                  //pageNum={pageNum}
                  updatePageCount={updatePageCount}
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
                  checkStatus={isCurrentOrUpcoming}
                  getAllSemesterProjects={handleGetAllSemesterProjects}
                  handleCreateSemester={handleCreateSemester}
                  handleUpdateSemester={handleUpdateSemester}
                  handleDeleteSemester={handleDeleteSemester}
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
