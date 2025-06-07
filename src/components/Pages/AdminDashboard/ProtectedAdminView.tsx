import type { JSX } from 'react'

import ClientService from '@/lib/services/client/ClientService'
import type { UserCombinedInfo } from '@/types/Collections'
import NavBar from '@/components/Generic/NavBar/NavBar'
import AdminDashboard from './AdminDashboard'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'

const UserInfo = async (): Promise<JSX.Element> => {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo
  return <NavBar onclick={handleLoginButtonClick} user={user} />
}

const ProtectedAdminView = (): JSX.Element => {
  return (
    <div>
      <UserInfo />
      <AdminDashboard />
    </div>
  )
}

export default ProtectedAdminView
