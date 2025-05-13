'use client'
import ClientsPage from '@/components/Pages/ClientsPage/ClientsPage'
import SemestersPage from '@/components/Pages/SemestersPage/SemestersPage'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { UniqueIdentifier } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { mockProjects } from '@/test-config/mocks/Project.mock'
import { mockClients } from '@/test-config/mocks/User.mock'
import { handleLoginButtonClick, isLoggedIn } from '@/lib/services/user/Handlers'
import { getAllSemesters } from '@/lib/util/adminSemesterUtils'
import { Semester } from '@/payload-types'
import { FiAlertCircle } from 'react-icons/fi'
import MobileAdminView from '@/app/(frontend)/admin/MobileAdminView'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)
  const [semestersData, setSemestersData] = useState<Semester[]>([])
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const fetchSemesters = async () => {
    const res = await getAllSemesters()
    if (res?.data) {
      setSemestersData(res.data)
    }
  }
  const message = created
    ? 'Semester created successfully'
    : updated
      ? 'Semester updated successfully'
      : deleted
        ? 'Semester deleted successfully'
        : ''

  useEffect(() => {
    fetchSemesters()
  }, [])

  useEffect(() => {
    if (showNotification) {
      fetchSemesters()
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  useEffect(() => {
    const saved = localStorage.getItem('adminNav')
    setActiveNav(saved !== null ? Number(saved) : 0)
    isLoggedIn().then((res) => {
      setLoggedIn(res)
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
      <NavBar
        navElements={[{ href: '/admin', text: 'My Dashboard' }]}
        onclick={handleLoginButtonClick}
        loggedIn={loggedIn}
      />
      <div className="hidden lg:block w-full">
        <div className="mt-25 w-full flex justify-center items-center gap-25 bg-beige pb-7">
          <div
            className={` ${showNotification ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 fixed top-6 right-6 z-50 bg-light-pink ring ring-2 ring-pink-soft shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`}
          >
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-pink-accent w-5 h-5 flex-shrink-0" />
              <p className="text-dark-pink font-medium">{message}</p>
            </div>
          </div>
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
                <ClientsPage clients={mockClients} />
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
                    setCreated(true)
                  }}
                  updated={() => {
                    setShowNotification(true)
                    setUpdated(true)
                  }}
                  deleted={() => {
                    setShowNotification(true)
                    setDeleted(true)
                  }}
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
