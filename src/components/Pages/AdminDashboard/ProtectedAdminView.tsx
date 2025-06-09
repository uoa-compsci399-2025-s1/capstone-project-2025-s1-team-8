import type { JSX } from 'react'

import ClientService from '@/lib/services/client/ClientService'
import type { UserCombinedInfo } from '@/types/Collections'
import NavBar from '@/components/Generic/NavBar/NavBar'
import AdminDashboard from './AdminDashboard'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'

const ProtectedAdminView = async (): Promise<JSX.Element> => {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo

  return (
    <div>
      <NavBar onclick={handleLoginButtonClick} user={user} />
      <AdminDashboard />
    </div>
  )
}

export default ProtectedAdminView
