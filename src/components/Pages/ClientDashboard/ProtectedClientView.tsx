import { type JSX, Suspense } from 'react'

import NavBar from '@/components/Generic/NavBar/NavBar'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'
import ClientService from '@/lib/services/client/ClientService'
import { handleClientProfileUpdate } from '@/lib/services/client/Handlers'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import type { UserCombinedInfo } from '@/types/Collections'
import ContentService from '@/lib/services/content/ContentService'
import { handleDeleteProject } from '@/lib/services/admin/Handlers'
import { useClientPage } from '@/lib/hooks/useClientPage'

const ProtectedClientView = async (): Promise<JSX.Element> => {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo

  const { content: clientDashboardCMS } = await ContentService.getClientDashboard()

  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar user={user} onclick={handleLoginButtonClick} />
      </div>
      <div className="items-center justify-center w-full px-8 sm:px-15 lg:px-30 pt-35 pb-20">
        <Suspense
          fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}
        >
          <ClientDashboard
            client={user}
            content={clientDashboardCMS}
            onSave={handleClientProfileUpdate}
            onDeleteProject={handleDeleteProject}
            useClientPage={useClientPage as any}
          />
        </Suspense>
      </div>
    </div>
  )
}
export default ProtectedClientView
