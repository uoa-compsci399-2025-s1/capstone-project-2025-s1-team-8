import NavBar from '@/components/Generic/NavBar/NavBar'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'
import ClientService from '@/lib/services/client/ClientService'
import type { UserCombinedInfo } from '@/types/Collections'
import { StudentPage } from './StudentPage'

export default async function ProtectedStudentView() {
  const userInfo = await ClientService.getClientInfo()
  const studentInfo: UserCombinedInfo = userInfo.userInfo
  return (
    <div>
      <NavBar user={studentInfo} onclick={handleLoginButtonClick} />
      <StudentPage />
    </div>
  )
}
