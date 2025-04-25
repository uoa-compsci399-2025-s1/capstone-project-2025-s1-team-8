'use client'

import ClientsPage from '@/components/Pages/ClientsPage/ClientsPage'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']
  const [activeNav, setActiveNav] = useState(() => {
    const saved = localStorage.getItem('adminNav')
    return saved !== null ? Number(saved) : 0
  })

  // Save nav index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminNav', String(activeNav))
  }, [activeNav])

  const containers = [
    {
      id: 'container-1' as UniqueIdentifier,
      title: 'Rejected',
      containerColor: 'light' as const,
      items: [],
    },
    {
      id: 'container-2' as UniqueIdentifier,
      title: 'Pending',
      containerColor: 'medium' as const,
      items: [],
    },
    {
      id: 'container-3' as UniqueIdentifier,
      title: 'Accepted',
      containerColor: 'dark' as const,
      items: [],
    },
  ]

  return (
    <div className="w-full">
      <NavBar navElements={[{ href: '/admin', text: 'My Dashboard' }]} />

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
            className="flex flex-1 min-h-0 [direction:ltr] [will-change:transform]"
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
              <ClientsPage clients={[]} />
            </div>

            <div
              className="admin-dash-carousel-item"
              aria-hidden={activeNav !== 2}
              tabIndex={activeNav === 2 ? 0 : -1}
            >
              <p>Semester page goes here</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Admin
