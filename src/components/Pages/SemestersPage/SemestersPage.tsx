'use client'

import { useRef, useState } from 'react'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'
import type { Semester } from '@/payload-types'
import type { ProjectDetails } from '@/types/Project'
import type { typeToFlattenedError } from 'zod'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'

interface SemestersPageProps {
  semesters: Semester[]
  created: () => void
  updated: () => void
  deleted: () => void
  handleCreateSemester: (formData: FormData) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  handleUpdateSemester: (
    formData: FormData,
    id: string,
  ) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  handleDeleteSemester: (id: string) => Promise<void | {
    error?: string
    message?: string
  }>
  semesterStatuses?: Record<string, 'current' | 'upcoming' | ''>
  semesterProjects?: Record<string, ProjectDetails[]>
}

const SemestersPage: React.FC<SemestersPageProps> = ({
  semesters,
  created,
  updated,
  deleted,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
  semesterStatuses = {},
  semesterProjects = {},
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const upcomingSemesterRef = useRef<HTMLDivElement>(null)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  const scrollToCurrentSemester = () => {
    upcomingSemesterRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between pb-8">
        <Button
          size="md"
          className="bg-light-beige border-[1.2px] border-steel-blue text-dark-blue hover:bg-deeper-blue hover:text-white w-[49%]"
          onClick={() => toggleModal()}
        >
          Create new semester
        </Button>

        <Button
          size="md"
          className="bg-light-beige border-[1.2px] border-steel-blue text-dark-blue hover:bg-deeper-blue hover:text-white w-[49%]"
          onClick={scrollToCurrentSemester}
        >
          Go to current semester
        </Button>
      </div>
      {semesters.map((semester) => (
        <div
          key={semester.id || semester.name}
          ref={
            semester.id && semesterStatuses[semester.id] === 'upcoming' ? upcomingSemesterRef : null
          }
        >
          <SemesterCard
            semester={semester as Semester}
            id={semester.id}
            name={semester.name}
            deadline={semester.deadline}
            startDate={semester.startDate}
            endDate={semester.endDate}
            updatedAt={semester.updatedAt}
            createdAt={semester.createdAt}
            currentOrUpcoming={semesterStatuses[semester.id] || ''}
            semesterProjects={semesterProjects[semester.id] || []}
          />
        </div>
      ))}
      <SemesterForm
        open={modalOpen}
        semesterId="-1"
        onClose={() => toggleModal()}
        onCreated={() => {
          created?.()
        }}
        onUpdated={() => {
          updated?.()
        }}
        onDeleted={() => {
          deleted?.()
        }}
        handleCreateSemester={handleCreateSemester}
        handleUpdateSemester={handleUpdateSemester}
        handleDeleteSemester={handleDeleteSemester}
      />
    </div>
  )
}

export default SemestersPage
