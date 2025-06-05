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
  handleDeleteClient,
  handleUpdateClient,
  handleDeleteProject,
  getNextSemesterProjects,
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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clients: initialClients,
  semesters: initialSemesters,
  projects: initialProjects,
  totalNumPages = 0,
}) => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters)
  const [clients, setClients] =
    useState<{ client: UserCombinedInfo; projects: ProjectDetails[] }[]>(initialClients)
  const [projects, setProjects] = useState<SemesterContainerData>(initialProjects)
  const [pageNum, setPageNum] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(totalNumPages)
  const itemsPerPage = 10

  const searchForClients = async (searchValue: string) => {
    const query = searchValue.trim().toLowerCase()
    const res = await getAllClients({ limit: itemsPerPage, page: 1, query })
    setClients(res?.data || [])
    setPageNum(1)
    if (res?.totalPages) {
      setTotalPages(res.totalPages)
    } else {
      setTotalPages(0)
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
        const res = await getAllClients({ limit: itemsPerPage, page: 1, query })
        return setClients(res?.data || [])
      }
      if (lastPage) {
        if (totalPages === 0 || pageNum === totalPages) {
          return
        }
        setPageNum(totalPages)
        const res = await getAllClients({ limit: itemsPerPage, page: totalPages, query })
        return setClients(res?.data || [])
      }
      if (increment) {
        if (pageNum < totalPages) {
          const res = await getAllClients({ limit: itemsPerPage, page: pageNum + 1, query })
          setPageNum(pageNum + 1)
          setClients(res?.data || [])
        }
      } else {
        if (pageNum > 1) {
          const res = await getAllClients({ limit: itemsPerPage, page: pageNum - 1, query })
          setPageNum(pageNum - 1)
          setClients(res?.data || [])
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

  const refreshClients = async () => {
    const res = await getAllClients()
    if (res?.data) {
      setClients(res.data)
    }
  }

  const refreshProjects = async () => {
    const res = await getNextSemesterProjects()
    if (res?.data) {
      setProjects(res.data)
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
                  onDeleteProject={handleDeleteProject}
                  deletedProject={async () => {
                    setNotificationMessage('Project deleted successfully')
                    await refreshProjects()
                  }}
                />
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 1}
                tabIndex={activeNav === 1 ? 0 : -1}
              >
                <ClientsPage
                  clientsData={clients}
                  updatePageCount={updatePageCount}
                  totalPages={totalPages}
                  searchForClients={searchForClients}
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                  updatedClient={async () => {
                    await refreshClients()
                  }}
                  deletedClient={async () => {
                    await refreshClients()
                    setNotificationMessage('Client deleted successfully')
                  }}
                  onDeleteProject={handleDeleteProject}
                  deletedProject={async () => {
                    await refreshProjects()
                    setNotificationMessage('Project deleted successfully')
                  }}
                  isFetching={isFetching}
                  pageNum={pageNum}
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
                    await refreshProjects()
                    await refreshSemesters()
                    setNotificationMessage('Semester deleted successfully')
                  }}
                  checkStatus={isCurrentOrUpcoming}
                  getAllSemesterProjects={handleGetAllSemesterProjects}
                  handleCreateSemester={handleCreateSemester}
                  handleUpdateSemester={handleUpdateSemester}
                  handleDeleteSemester={handleDeleteSemester}
                  onDeleteProject={handleDeleteProject}
                  deletedProject={async () => {
                    await refreshProjects()
                    await refreshSemesters()
                    setNotificationMessage('Project deleted successfully')
                  }}
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
