'use client'
import type { ClientDashboard as ClientDashboardType, User } from '@/payload-types'
import ClientDashboard from './ClientDashboard'
import { handleClientProfileUpdate } from '@/lib/services/client/Handlers'
import { handleDeleteProject } from '@/lib/services/admin/Handlers'
import { useClientPage } from '@/lib/hooks/useClientPage'

interface IWrappedClientDashboard {
  user: User
  clientDashboardCMS: ClientDashboardType
}

const WrappedClientDashboard = ({ user, clientDashboardCMS }: IWrappedClientDashboard) => {
  return (
    <ClientDashboard
      client={user}
      content={clientDashboardCMS}
      onSave={handleClientProfileUpdate}
      onDeleteProject={handleDeleteProject}
      useClientPage={useClientPage}
    />
  )
}

export default WrappedClientDashboard
