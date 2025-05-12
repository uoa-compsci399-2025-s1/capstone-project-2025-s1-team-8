'use client'
import ClientsPage from '@/components/Pages/ClientsPage/ClientsPage'
import SemestersPage from '@/components/Pages/SemestersPage/SemestersPage'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { mockProjects } from '@/mocks/newProjects.mock'
import { clientMocks as mockClients } from '@/mocks/newClients.mock'
import { mockSemesters } from '@/mocks/newSemesters.mock'
import SadTeapot from 'src/assets/sad-teapot.svg'
import { handleLoginButtonClick, isLoggedIn } from '@/lib/services/user/Handlers'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']

  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)

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
                <SemestersPage semesters={mockSemesters} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div className="lg:hidden pt-30">
        <div
          className="mx-[10%] p-5 sm:p-6 rounded-2xl w-4/5 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] min-w-3xs overflow-y-hidden
        flex-1 flex-col flex items-center justify-center
        border border-gray-300
        bg-[linear-gradient(to_right,rgba(255,169,222,0.25),rgba(209,251,255,0.2)),linear-gradient(to_bottom,#fffef9,#d1fbff)]"
        >
          <SadTeapot className="mt-3 mb-3" />
          <div className="space-y-6 pb-10 px-6 sm:px-8">
            <p className="text-2xl sm:text-3xl md:text-4xl font-dm-serif-display text-dark-blue">
              Please switch to a desktop device
            </p>
            <p className="text-xs sm:test-sm md:text-base font-inter text-dark-blue">
              The current device is not supported for the admin dashboard.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
