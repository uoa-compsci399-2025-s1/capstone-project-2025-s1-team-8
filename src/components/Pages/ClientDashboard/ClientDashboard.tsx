import CreateProjectCard from '@/components/Composite/CreateProjectCard/CreateProjectCard'
import GradientTextArea from '@/components/Generic/GradientTextArea/GradientTextArea'
import ClientProfile from '@/components/Composite/ClientProfile/ClientProfile'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import { Project, Semester } from '@/payload-types'
import { UserCombinedInfo } from '@/types/Collections'

interface ClientDashboardProps {
  client: UserCombinedInfo
  projects: Project[]
  semesters: Semester [][]
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ client, projects, semesters }) => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-10 pb-12 items-stretch">
        <CreateProjectCard />
        <div className="row-start-2 -ml-5">
          <GradientTextArea
            heading="Tips for choosing a good project name:"
            text={`• Keep it short and straight to the point!
            • The description is there for a reason!`}
          />
        </div>
        <div className="lg:col-start-2 lg:row-span-2">
          <ClientProfile clientInfo={client} />
        </div>
      </div>
      <ProjectCardList
        className="bg-muted-blue-op-45 px-7 md:px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border"
        headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
        heading="My projects"
        projects={projects}
        semesters = {semesters}
      />
    </div>
  )
}

export default ClientDashboard
