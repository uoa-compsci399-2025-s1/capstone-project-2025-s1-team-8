import { SemesterDTOPlaceholder } from '@/components/Composite/SemesterCard/SemesterCard'
import SemesterCard from '@/components/Composite/SemesterCard/SemesterCard'

interface SemestersPageProps {
  semesters: SemesterDTOPlaceholder[]
}

const SemestersPage: React.FC<SemestersPageProps> = ({ semesters }) => {

  return (
    <div className="w-full">
      {semesters.map(semester => (
        <SemesterCard {...semester}/>
      ))}
    </div>
  )
}

export default SemestersPage
