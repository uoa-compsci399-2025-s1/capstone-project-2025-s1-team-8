'use client'

import { useRef, useState } from 'react'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'
import type { Semester } from '@/payload-types'
import type { typeToFlattenedError } from 'zod'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'

interface SemestersPageProps {
  semesters: Semester[]
  handleCreateSemester: (formData: FormData) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  createdSemester: () => void
  handleUpdateSemester: (
    formData: FormData,
    id: string,
  ) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  updatedSemester: () => void
  handleDeleteSemester: (id: string) => Promise<void | {
    error?: string
    message?: string
  }>
  deletedSemester: () => void
  onDeleteProject: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deletedProject: () => void
  semesterStatuses?: Record<string, 'current' | 'upcoming' | ''>
}

const SemestersPage: React.FC<SemestersPageProps> = ({
  semesters,
  handleCreateSemester,
  createdSemester,
  handleUpdateSemester,
  updatedSemester,
  handleDeleteSemester,
  deletedSemester,
  semesterStatuses = {},
  onDeleteProject,
  deletedProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const upcomingSemesterRef = useRef<HTMLDivElement>(null)
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null)

  const callSemesterForm = (semesterId: string) => {
    setEditingSemesterId(semesterId)
  }

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
            published={semester.published}
            currentOrUpcoming={semesterStatuses[semester.id] || ''}
            onEdit={callSemesterForm}
            onDeleteProject={onDeleteProject}
            deletedProject={deletedProject}
            onDeleteSemester={handleDeleteSemester}
            deletedSemester={deletedSemester}
          />
        </div>
      ))}

      <SemesterForm
        edit={editingSemesterId !== null}
        open={modalOpen || editingSemesterId !== null}
        semesterId={editingSemesterId || '-1'}
        onClose={() => {
          if (modalOpen) toggleModal()
          setEditingSemesterId(null)
        }}
        onCreated={() => {
          createdSemester?.()
          setEditingSemesterId(null)
        }}
        onUpdated={() => {
          updatedSemester?.()
          setEditingSemesterId(null)
        }}
        onDeleted={() => {
          deletedSemester?.()
          setEditingSemesterId(null)
        }}
        handleCreateSemester={handleCreateSemester}
        handleUpdateSemester={handleUpdateSemester}
        handleDeleteSemester={handleDeleteSemester}
        semesterName={
          editingSemesterId ? semesters.find((s) => s.id === editingSemesterId)?.name : ''
        }
        startDate={
          editingSemesterId
            ? new Date(semesters.find((s) => s.id === editingSemesterId)?.startDate || '')
            : undefined
        }
        endDate={
          editingSemesterId
            ? new Date(semesters.find((s) => s.id === editingSemesterId)?.endDate || '')
            : undefined
        }
        submissionDeadline={
          editingSemesterId
            ? new Date(semesters.find((s) => s.id === editingSemesterId)?.deadline || '')
            : undefined
        }
      />
    </div>
  )
}

export default SemestersPage
