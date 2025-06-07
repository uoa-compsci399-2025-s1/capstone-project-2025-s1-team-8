'use client'
import { motion } from 'framer-motion'
import { useState, Suspense } from 'react'
import { useQueryState } from 'nuqs'
import { useQueryClient } from '@tanstack/react-query'

import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { Semester } from '@/payload-types'
import {
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
  handlePublishChanges,
  updateProjectOrdersAndStatus,
} from '@/lib/services/admin/Handlers'
import SemestersPage from '../SemestersPage/SemestersPage'
import ClientsPage from '../ClientsPage/ClientsPage'
import Notification from '@/components/Generic/Notification/Notification'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'
import { prefetchClients } from '@/lib/hooks/useClients'
import { prefetchSemesters } from '@/lib/hooks/useSemesters'
import { prefetchProjects } from '@/lib/hooks/useProjects'
import { useSemesters } from '@/lib/hooks/useSemesters'
import { useProjects } from '@/lib/hooks/useProjects'
import ClientGroupSkeleton from '@/components/Generic/ClientGroupSkeleton/ClientGroupSkeleton'
import ProjectDnDSkeleton from '@/components/Generic/ProjectDnDSkeleton/ProjectDnDSkeleton'
import SemesterCardSkeleton from '@/components/Generic/SemesterCardSkeleton/SemesterCardSkeleton'

type AdminDashboardProps = {
  semesters?: Semester[]
  projects?: SemesterContainerData
  semesterStatusList?: Record<string, 'current' | 'upcoming' | ''>
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const AdminNavElements = ['Projects', 'Clients', 'Semesters']
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: '0' })
  const [notificationMessage, setNotificationMessage] = useState('')
  const queryClient = useQueryClient()

  const { data: semestersData, isLoading: isSemestersLoading } = useSemesters()
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects()

  const handleTabChange = async (index: number) => {
    setActiveTab(index.toString())
    if (index === 1) {
      await prefetchClients(queryClient, 1, '')
    } else if (index === 0) {
      await prefetchProjects(queryClient)
    } else if (index === 2) {
      await prefetchSemesters(queryClient)
    }
  }

  if (!activeTab) return null

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
              onClick={() => handleTabChange(i)}
              className="relative group p-2 nav-link-text"
            >
              <p>{nav}</p>
              <span
                className={`
                    nav-link-text-underline
                    scale-x-0 group-hover:scale-x-100
                    ${activeTab === i.toString() ? 'scale-x-100' : ''}
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
              animate={{ x: Number(activeTab) * -100 + '%' }}
            >
              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeTab !== '0'}
                tabIndex={activeTab === '0' ? 0 : -1}
              >
                {isProjectsLoading ? (
                  <ProjectDnDSkeleton />
                ) : (
                  <ProjectDnD
                    {...(projectsData || {
                      semesterId: '',
                      presetContainers: [],
                    })}
                    onSaveChanges={updateProjectOrdersAndStatus}
                    onPublishChanges={handlePublishChanges}
                  />
                )}
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeTab !== '1'}
                tabIndex={activeTab === '1' ? 0 : -1}
              >
                <Suspense fallback={<ClientGroupSkeleton />}>
                  <ClientsPage />
                </Suspense>
              </div>

              <div
                className="admin-dash-carousel-item"
                aria-hidden={activeTab !== '2'}
                tabIndex={activeTab === '2' ? 0 : -1}
              >
                {isSemestersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <SemesterCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <SemestersPage
                    semesters={semestersData?.data || []}
                    created={async () => {
                      await queryClient.invalidateQueries({ queryKey: ['semesters'] })
                      setNotificationMessage('Semester created successfully')
                    }}
                    updated={async () => {
                      await queryClient.invalidateQueries({ queryKey: ['semesters'] })
                      setNotificationMessage('Semester updated successfully')
                    }}
                    deleted={async () => {
                      await queryClient.invalidateQueries({ queryKey: ['semesters'] })
                      setNotificationMessage('Semester deleted successfully')
                    }}
                    handleCreateSemester={handleCreateSemester}
                    handleUpdateSemester={handleUpdateSemester}
                    handleDeleteSemester={handleDeleteSemester}
                    semesterStatuses={semestersData?.semesterStatuses || {}}
                  />
                )}
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
