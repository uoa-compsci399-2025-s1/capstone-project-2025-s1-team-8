import { useEffect, useRef, useState } from 'react'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'
import { Semester } from '@/payload-types'
import { isCurrentOrUpcoming } from '@/lib/services/admin/Handlers'

interface SemestersPageProps {
  semesters: Semester[]
  created: () => void
  updated: () => void
  deleted: () => void
}

const SemestersPage: React.FC<SemestersPageProps> = ({ semesters, created, updated, deleted }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [semesterStatuses, setSemesterStatuses] = useState<Record<string, string>>({})
  const currentSemesterRef = useRef<HTMLDivElement>(null)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  useEffect(() => {
    const loadStatuses = async () => {
      const statuses: Record<string, string> = {}
      for (const semester of semesters) {
        if (semester.id) {
          statuses[semester.id] = await isCurrentOrUpcoming(semester.id)
        }
      }
      setSemesterStatuses(statuses)
    }
    loadStatuses()
  }, [semesters])

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
          <SemesterCard {...semester} />
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
      />
    </div>
  )
}

export default SemestersPage
