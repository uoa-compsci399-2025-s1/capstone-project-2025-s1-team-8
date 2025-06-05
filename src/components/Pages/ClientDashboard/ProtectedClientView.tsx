import { type JSX, Suspense } from 'react'

import NavBar from '@/components/Generic/NavBar/NavBar'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'
import ClientService from '@/lib/services/client/ClientService'
import { handleClientPageLoad, handleClientProfileUpdate } from '@/lib/services/client/Handlers'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import type { UserCombinedInfo } from '@/types/Collections'
import type { ProjectDetails } from '@/types/Project'
import { handleDeleteProject } from '@/lib/services/admin/Handlers'
import ContentService from '@/lib/services/content/ContentService'

const ProtectedClientView = async (): Promise<JSX.Element> => {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo
  const projects: ProjectDetails[] = (await handleClientPageLoad()).projects

  const { content: clientDashboardCMS } = await ContentService.getClientDashboard()

  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar user={user} onclick={handleLoginButtonClick} />
      </div>
      <div className="items-center justify-center w-full px-8 sm:px-15 lg:px-30 pt-35 pb-20">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ClientDashboard
            content={clientDashboardCMS}
            client={user}
            projects={projects}
            onSave={handleClientProfileUpdate}
            onDeleteProject={handleDeleteProject}
          />
        </Suspense>
      </div>
    </div>
  )
}
export default ProtectedClientView
