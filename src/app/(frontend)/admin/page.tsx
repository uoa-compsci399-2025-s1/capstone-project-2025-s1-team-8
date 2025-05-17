'use client'
import ClientsPage from '@/components/Pages/ClientsPage/ClientsPage'
import SemestersPage from '@/components/Pages/SemestersPage/SemestersPage'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { UniqueIdentifier } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { mockProjects } from '@/test-config/mocks/Project.mock'
import { handleLoginButtonClick, getLoggedInUser } from '@/lib/services/user/Handlers'
import {
  getAllSemesters,
  isCurrentOrUpcoming,
  getAllSemesterProjects,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
} from '@/lib/services/admin/Handlers'
import { Semester } from '@/payload-types'
import MobileAdminView from '@/app/(frontend)/admin/MobileAdminView'
import { UserCombinedInfo } from '@/types/Collections'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types/User'
import { getAllClients } from '@/lib/services/admin/Handlers'
import { ProjectDetails } from '@/types/Project'
import Notification from '@/components/Generic/Notification/Notification'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [loggedInUser, setLoggedInUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)
  const [semestersData, setSemestersData] = useState<Semester[]>([])
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const [clientsData, setClientsData] = useState<
    { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  >([])

  const fetchSemesters = async () => {
    const res = await getAllSemesters()
    if (res?.data) {
      setSemestersData(res.data)
    }
  }

  const fetchClients = async () => {
    const res = await getAllClients()
    if (res?.data) {
      setClientsData(res.data)
    }
  }

  useEffect(() => {
    fetchSemesters()
    fetchClients()
  }, [semestersData, clientsData])

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  useEffect(() => {
    const saved = localStorage.getItem('adminNav')
    setActiveNav(saved !== null ? Number(saved) : 0)
    getLoggedInUser().then((res) => {
      setLoggedInUser(res)
      setLoginLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (activeNav !== null) {
      localStorage.setItem('adminNav', String(activeNav))
    }
  }, [activeNav])

  // Don't render anything until activeNav is ready
  if (activeNav === null || !loginLoaded) return null
  if (!loggedInUser || loggedInUser.role !== UserRole.Admin) {
    redirect('/not-found')
  }

  const containers = [
    {
      id: 'container-1' as UniqueIdentifier,
      title: 'Rejected',
      containerColor: 'light' as const,
      currentItems: [
        {
          id: `item-1`,
          projectInfo: mockProjects[0],
        },
        {
          id: `item-2`,
          projectInfo: mockProjects[1],
        },
      ],
      originalItems: [
        {
          id: `item-1`,
          projectInfo: mockProjects[0],
        },
        {
          id: `item-2`,
          projectInfo: mockProjects[1],
        },
      ],
    },
    {
      id: 'container-2' as UniqueIdentifier,
      title: 'Pending',
      containerColor: 'medium' as const,
      currentItems: [],
      originalItems: [],
    },
    {
      id: 'container-3' as UniqueIdentifier,
      title: 'Accepted',
      containerColor: 'dark' as const,
      currentItems: [],
      originalItems: [],
    },
  ]

  return (
    <div>
      <NavBar onclick={handleLoginButtonClick} user={loggedInUser} />
      <div className="hidden lg:block w-full">
        <div className="fixed top-6 right-6 z-50">
          <Notification
            isVisible={showNotification}
            title={'Success'}
            message={notificationMessage ?? 'hello world'}
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
                <ProjectDnD presetContainers={containers} />
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 1}
                tabIndex={activeNav === 1 ? 0 : -1}
              >
                <ClientsPage clients={clientsData} />
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeNav !== 2}
                tabIndex={activeNav === 2 ? 0 : -1}
              >
                <SemestersPage
                  semesters={semestersData}
                  created={() => {
                    setShowNotification(true)
                    setNotificationMessage('Semester created successfully')
                  }}
                  updated={() => {
                    setShowNotification(true)
                    setNotificationMessage('Semester updated successfully')
                  }}
                  deleted={() => {
                    setShowNotification(true)
                    setNotificationMessage('Semester deleted successfully')
                  }}
                  checkStatus={isCurrentOrUpcoming}
                  getAllSemesterProjects={getAllSemesterProjects}
                  handleCreateSemester={handleCreateSemester}
                  handleUpdateSemester={handleUpdateSemester}
                  handleDeleteSemester={handleDeleteSemester}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* mobile view */}
      <MobileAdminView />
    </div>
  )
}

export default Admin
