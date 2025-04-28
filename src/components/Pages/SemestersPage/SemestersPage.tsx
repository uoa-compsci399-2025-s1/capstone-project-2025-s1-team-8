import { useRef, useState } from 'react'
import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'

interface SemestersPageProps {
  semesters: SemesterDTOPlaceholder[]
}

const SemestersPage: React.FC<SemestersPageProps> = ({ semesters }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const currentSemesterRef = useRef<HTMLDivElement>(null)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

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
        <SemesterForm open={modalOpen} onClose={() => toggleModal()} />

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
          key={semester.semesterName}
          ref={semester.currentOrUpcoming === 'current' ? currentSemesterRef : null}
        >
          <SemesterCard {...semester} />
        </div>
      ))}
    </div>
  )
}

export default SemestersPage
