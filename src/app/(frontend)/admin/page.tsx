'use client'

import ClientsPage from '@/components/Pages/ClientsPage/ClientsPage'
import SemestersPage from '@/components/Pages/SemestersPage/SemestersPage'
import ProjectDnD, {
  type SemesterContainerData,
} from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { handleLoginButtonClick, getLoggedInUser } from '@/lib/services/user/Handlers'
import {
  isCurrentOrUpcoming,
  handleGetAllSemesterProjects,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
  handleGetAllSemesters,
} from '@/lib/services/admin/Handlers'
import type { Semester } from '@/payload-types'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'
import type { UserCombinedInfo } from '@/types/Collections'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types/User'
import { getAllClients } from '@/lib/services/admin/Handlers'
import type { ProjectDetails } from '@/types/Project'
import Notification from '@/components/Generic/Notification/Notification'

import { getNextSemesterProjects } from '@/lib/services/admin/Handlers'
import { handlePublishChanges, updateProjectOrdersAndStatus } from '@/lib/services/admin/Handlers'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [loggedInUser, setLoggedInUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)
  const [semestersData, setSemestersData] = useState<Semester[]>([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [clientsData, setClientsData] = useState<
    { client: UserCombinedInfo; projects: ProjectDetails[] }[]
  >([])
  const [projectsData, setProjectsData] = useState<SemesterContainerData>(
    {} as SemesterContainerData,
  )
  const [semestersLoaded, setSemestersLoaded] = useState<boolean>(false)
  const [clientsLoaded, setClientsLoaded] = useState<boolean>(false)
  const [projectsLoaded, setProjectsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!semestersLoaded) {
      const fetchSemesters = async () => {
        handleGetAllSemesters().then((response) => {
          if (response) {
            setSemestersData(response.data ? response.data : [])
            setSemestersLoaded(true)
          }
        })
      }
      fetchSemesters()
    }
  }, [semestersLoaded])

  useEffect(() => {
    if (!clientsLoaded) {
      const fetchClients = async () => {
        getAllClients().then((response) => {
          if (response) {
            setClientsData(response.data ? response.data : [])
            setClientsLoaded(true)
          }
        })
      }
      fetchClients()
    }
  }, [clientsLoaded])

  useEffect(() => {
    if (!projectsLoaded) {
      const fetchProjects = async () => {
        getNextSemesterProjects().then((response) => {
          if (response) {
            setProjectsData(
              response.data ? response.data : { semesterId: '', presetContainers: [] },
            )
            setProjectsLoaded(true)
          }
        })
      }
      fetchProjects()
    }
  }, [projectsLoaded])

  useEffect(() => {
    if (notificationMessage !== '') {
      const timer = setTimeout(() => {
        setNotificationMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notificationMessage])

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

  return (
    <div>
      <NavBar onclick={handleLoginButtonClick} user={loggedInUser} />
      <div className="hidden lg:block w-full">
        <div className="fixed top-6 right-6 z-50">
          <Notification
            isVisible={notificationMessage !== ''}
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
                <ProjectDnD
                  {...projectsData}
                  onSaveChanges={updateProjectOrdersAndStatus}
                  onPublishChanges={handlePublishChanges}
                />
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
                    setNotificationMessage('Semester created successfully')
                    setSemestersLoaded(false)
                  }}
                  updated={() => {
                    setNotificationMessage('Semester updated successfully')
                    setSemestersLoaded(false)
                  }}
                  deleted={() => {
                    setNotificationMessage('Semester deleted successfully')
                    setSemestersLoaded(false)
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

      {/* mobile view */}
      <div className="lg:hidden pt-30">
        <TeapotCard
          title={'Please switch to a desktop device'}
          description=" The current device is not supported for the admin dashboard."
          type="margin-10"
        />
      </div>
    </div>
  )
}

export default Admin
