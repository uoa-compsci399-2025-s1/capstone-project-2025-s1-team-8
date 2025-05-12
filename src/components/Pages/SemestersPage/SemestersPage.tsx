import { useEffect, useRef, useState } from 'react'
import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'
import Button from '@/components/Generic/Button/Button'
import SemesterForm from '@/components/Composite/SemesterForm/SemesterForm'
import { FiAlertCircle } from 'react-icons/fi'

interface SemestersPageProps {
  semesters: SemesterDTOPlaceholder[]
}

const SemestersPage: React.FC<SemestersPageProps> = ({ semesters }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [created, setCreated] = useState(false)

  // useEffect(() => {
  //   if (created) {
  //     setShowNotification(true)
  //   } else {
  //     setShowNotification(false)
  //   }
  // }, [created])

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const currentSemesterRef = useRef<HTMLDivElement>(null)

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  const scrollToCurrentSemester = () => {
    currentSemesterRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full">
      <SemesterForm
        open={modalOpen}
        semesterId="-1"
        onClose={() => toggleModal()}
        onCreated={() => {
          setShowNotification(true)
        }}
      />

      {/*Notification*/}
      <div
        // className={` ${showNotification ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 fixed top-6 right-6 z-50 bg-light-pink ring ring-2 ring-pink-soft shadow-md rounded-lg px-6 py-4 max-w-md flex flex-col`}
        className={` ${showNotification ? 'opacity-100 visible' : 'opacity-0 invisible'} `}
      >
        <div className="flex items-center gap-2">
          <FiAlertCircle className="text-pink-accent w-5 h-5 flex-shrink-0" />
          <p className="text-dark-pink font-medium">Created!!</p>
        </div>
      </div>

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
