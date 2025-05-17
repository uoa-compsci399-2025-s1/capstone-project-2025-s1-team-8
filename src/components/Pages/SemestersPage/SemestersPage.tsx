import { useEffect, useRef, useState } from 'react'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'
import { Semester } from '@/payload-types'
import { ProjectDetails } from '@/types/Project'
import { typeToFlattenedError } from 'zod'
import { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'

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
  const currentSemesterRef = useRef<HTMLDivElement>(null)

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
    currentSemesterRef.current?.scrollIntoView({ behavior: 'smooth' })
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
            semester.id && semesterStatuses[semester.id] === 'current' ? currentSemesterRef : null
          }
        >
          <SemesterCard
            getAllSemesterProjects={getAllSemesterProjects}
            checkStatus={checkStatus}
            semester={semester as Semester}
            id={semester.id}
            name={semester.name}
            deadline={semester.deadline}
            startDate={semester.startDate}
            endDate={semester.endDate}
            updatedAt={semester.updatedAt}
            createdAt={semester.createdAt}
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
