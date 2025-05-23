'use client'

import { useEffect, useRef, useState } from 'react'
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
  checkStatus?: (id: string) => Promise<'current' | 'upcoming' | ''>
  getAllSemesterProjects: (
    id: string,
  ) => Promise<void | { error?: string; data?: ProjectDetails[] }>
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
}

const SemestersPage: React.FC<SemestersPageProps> = ({
  semesters,
  created,
  updated,
  deleted,
  getAllSemesterProjects,
  checkStatus,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [semesterStatuses, setSemesterStatuses] = useState<
    Record<string, 'current' | 'upcoming' | ''>
  >({})
  const upcomingSemesterRef = useRef<HTMLDivElement>(null)
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null)

  const callSemesterForm = (semesterId: string) => {
    setEditingSemesterId(semesterId)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  useEffect(() => {
    const loadStatuses = async () => {
      const statuses: Record<string, 'current' | 'upcoming' | ''> = {}
      if (!checkStatus) return
      for (const semester of semesters) {
        if (semester.id) {
          statuses[semester.id] = await checkStatus(semester.id)
        }
      }
      setSemesterStatuses(statuses)
    }
    loadStatuses()
  }, [semesters, checkStatus])

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
            semesterProjects={getAllSemesterProjects}
            checkStatus={checkStatus}
            semester={semester as Semester}
            id={semester.id}
            name={semester.name}
            deadline={semester.deadline}
            startDate={semester.startDate}
            endDate={semester.endDate}
            updatedAt={semester.updatedAt}
            createdAt={semester.createdAt}
            onEdit={callSemesterForm}
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
          created?.()
          setEditingSemesterId(null)
        }}
        onUpdated={() => {
          updated?.()
          setEditingSemesterId(null)
        }}
        onDeleted={() => {
          deleted?.()
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
            : null
        }
        endDate={
          editingSemesterId
            ? new Date(semesters.find((s) => s.id === editingSemesterId)?.endDate || '')
            : null
        }
        submissionDeadline={
          editingSemesterId
            ? new Date(semesters.find((s) => s.id === editingSemesterId)?.deadline || '')
            : null
        }
      />
    </div>
  )
}

export default SemestersPage
