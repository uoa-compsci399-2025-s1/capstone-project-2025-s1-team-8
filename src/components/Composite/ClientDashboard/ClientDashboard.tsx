import CreateProjectCard from '@/components/Composite/CreateProjectCard/CreateProjectCard'
import GradientTextArea from '@/components/Generic/GradientTextArea/GradientTextArea'
import ClientProfile from '@/components/Composite/ClientProfile/ClientProfile'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { ClientDTOPlaceholder } from '@/components/Generic/ClientCard/ClientCard'

interface ClientDashboardProps {
  client: ClientDTOPlaceholder
  projects: ProjectDTOPlaceholder[]
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ client, projects }) => {
  return (
    <div className="bg-beige p-15">
      <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-10 pb-12 items-stretch">
        <CreateProjectCard />
        <div className="row-start-2 -ml-5">
          <GradientTextArea
            heading="Tips for choosing a good project name:"
            text={`• Keep it short and straight to the point!
            • The description is there for a reason!`}
          />
        </div>
        <div className="col-start-2 row-span-2">
          <ClientProfile clientInfo={client} />
        </div>
      </div>
      <ProjectCardList
        className="bg-muted-blue-op-45 px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border"
        headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
        heading="My projects"
        projects={projects}
      />
    </div>
  )
}

export default ClientDashboard
