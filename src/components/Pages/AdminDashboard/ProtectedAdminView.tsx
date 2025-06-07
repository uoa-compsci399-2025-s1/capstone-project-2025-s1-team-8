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
  try {
    const clientInfo = await ClientService.getClientInfo()
    const user: UserCombinedInfo = clientInfo.userInfo as UserCombinedInfo

    const fetchedAllClients = await getAllClients()
    if (!fetchedAllClients || fetchedAllClients.error || !fetchedAllClients.data) {
      throw new Error('Failed to fetch clients')
    }
    const clientsData = fetchedAllClients.data
    const totalPages = fetchedAllClients?.totalPages || 0

    const fetchAllSemesters = await handleGetAllSemesters()
    if (!fetchAllSemesters || fetchAllSemesters.error || !fetchAllSemesters.data) {
      throw new Error('Failed to fetch semesters')
    }
    const semestersData: Semester[] = fetchAllSemesters.data
    const semesterStatuses: Record<string, 'current' | 'upcoming' | ''> =
      fetchAllSemesters?.semesterStatuses || {}

    const fetchProjects = await getNextSemesterProjects()
    if (!fetchProjects || fetchProjects.error || !fetchProjects.data) {
      throw new Error('Failed to fetch projects')
    }
    const projectsData: SemesterContainerData = fetchProjects.data

    return (
      <div>
        <NavBar onclick={handleLoginButtonClick} user={user} />
        <AdminDashboard
          clients={clientsData}
          semesters={semestersData}
          projects={projectsData}
          totalNumPages={totalPages}
          semesterStatusList={semesterStatuses}
        />
      </div>
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Something went wrong while fetching admin data: ${err.message}`)
    } else {
      throw new Error(`Something went wrong while fetching admin data: ${String(err)}`)
    }
  }
}

export default ProtectedAdminView
