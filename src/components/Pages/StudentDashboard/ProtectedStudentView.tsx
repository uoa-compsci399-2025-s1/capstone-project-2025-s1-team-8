import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { handleStudentPageLoad } from '@/lib/services/student/Handlers'
import { TeapotCard } from '@/components/Generic/TeapotCard/TeapotCard'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import ClientService from '@/lib/services/client/ClientService'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'

export default async function ProtectedStudentView() {
  const res = await handleStudentPageLoad()
  const semesterName = res.name
  const projects: ProjectDetails[] = res.projects
  console.log(res)

  const userInfo = await ClientService.getClientInfo()
  const studentInfo: UserCombinedInfo = userInfo.userInfo

  return (
    <div>
      <NavBar user={studentInfo} onclick={handleLoginButtonClick} />
      <div>
        {projects.length && (
          <div className="pt-35 pb-20 items-center justify-center w-full px-8 sm:px-15 lg:px-30">
            <ProjectCardList
              className="bg-muted-blue-op-45 px-7 md:px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border"
              headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
              heading={semesterName}
              projects={projects}
              type="student"
            />
          </div>
        )}
        {!projects && (
          <TeapotCard
            title="Projects haven't been published yet"
            description="Please check back at a later date!"
            center={true}
            className="pt-30"
          />
        )}
      </div>
    </div>
  )
}
