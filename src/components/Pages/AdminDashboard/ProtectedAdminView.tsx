import type { JSX } from 'react'

import {
  getAllClients,
  handleGetAllSemesters,
  getNextSemesterProjects,
} from '@/lib/services/admin/Handlers'
import ClientService from '@/lib/services/client/ClientService'
import type { UserCombinedInfo } from '@/types/Collections'
import type { Semester } from '@/payload-types'
import type { SemesterContainerData } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import NavBar from '@/components/Generic/NavBar/NavBar'
import AdminDashboard from './AdminDashboard'
import { handleLoginButtonClick } from '@/lib/services/user/Handlers'

const ProtectedAdminView = async (): Promise<JSX.Element> => {
  const clientInfo = await ClientService.getClientInfo()
  const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo

  const fetchedAllClients = await getAllClients()
  const clientsData = fetchedAllClients?.data || []
  const totalPages = fetchedAllClients?.totalPages || 0
  console.log('Total Pages:', totalPages)

  const fetchAllSemesters = await handleGetAllSemesters()
  const semestersData: Semester[] = fetchAllSemesters?.data || []

  const fetchProjects = await getNextSemesterProjects()
  const projectsData: SemesterContainerData = fetchProjects?.data || {
    semesterId: '',
    presetContainers: [],
  }

  return (
    <div>
      <NavBar onclick={handleLoginButtonClick} user={user} />
      <AdminDashboard
        clients={clientsData}
        semesters={semestersData}
        projects={projectsData}
        totalPages={totalPages}
      />
    </div>
  )
}

export default ProtectedAdminView
