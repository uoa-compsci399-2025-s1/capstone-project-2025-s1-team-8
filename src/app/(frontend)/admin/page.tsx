'use client'
import ClientGroup from '@/components/Composite/ClientGroup/ClientGroup'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { mockClients } from '@/mocks/Clients.mock'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useState } from 'react'
import { motion } from 'framer-motion'
import SemesterCard, { SemesterCardProps } from '@/components/Composite/SemesterCard/SemesterCard'
import { mockProjects1 } from '@/mocks/Projects.mock'

const Admin = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']
  const [activeNav, setActiveNav] = useState(0)

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

  const mockProps: SemesterCardProps = {
    semesterName: 'Semester 2 2025',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-15'),
    submissionDeadline: new Date('2025-01-30'),
    approvedProjects: mockProjects1,
  }

  return (
    <div className="w-full">
      <NavBar navElements={[{ href: '/admin', text: 'My Dashboard' }]} />

      <div className="fixed top-25 w-full z-50 flex justify-center items-center gap-25 bg-beige pb-7">
        {AdminNavElements.map((nav, i) => (
          <button
            key={nav}
            onClick={() => {
              setActiveNav(i)
            }}
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

      <div className="py-4 mt-40 relative min-h-[300px]">
        <div className={`flex flex-col overflow-hidden w-full`}>
          <motion.div
            className={`flex flex-1 min-h-0 [direction:ltr] [will-change:transform]`}
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
              aria-hidden={activeNav !== 1}
              tabIndex={activeNav === 1 ? 0 : -1}
            >
              <ProjectDnD presetContainers={containers} />
            </div>

            <div
              className="admin-dash-carousel-item"
              aria-hidden={activeNav !== 1}
              tabIndex={activeNav === 1 ? 0 : -1}
            >
              <ClientGroup clients={mockClients} />
            </div>

            <div
              className="admin-dash-carousel-item"
              aria-hidden={activeNav !== 2}
              tabIndex={activeNav === 2 ? 0 : -1}
            >
              <SemesterCard {...mockProps} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Admin
