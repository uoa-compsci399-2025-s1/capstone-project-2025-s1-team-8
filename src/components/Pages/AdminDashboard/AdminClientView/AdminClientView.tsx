import { useClients } from '@/lib/hooks/useClients'
import { useQueryClient } from '@tanstack/react-query'
import ClientsPage from '../../ClientsPage/ClientsPage'
import ClientGroupSkeleton from '@/components/Generic/ClientGroupSkeleton/ClientGroupSkeleton'
import {
  handleDeleteClient,
  handleDeleteProject,
  handleUpdateClient,
} from '@/lib/services/admin/Handlers'
import { Suspense } from 'react'
import { useClientProjects } from '@/lib/hooks/useClientProjects'

interface IAdminClientView {
  /**
   * Function used to set the notification message
   */
  setNotificationMessage: (message: string) => void
}

const AdminClientView = ({ setNotificationMessage }: IAdminClientView) => {
  const queryClient = useQueryClient()

  return (
    <Suspense fallback={<ClientGroupSkeleton />}>
      <ClientsPage
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        updatedClient={async () => {
          await queryClient.invalidateQueries({ queryKey: ['clients'] })
          await queryClient.invalidateQueries({ queryKey: ['projects'] })
          await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] }) // do this for every semester the project is in
          await queryClient.invalidateQueries({ queryKey: ['clientProjects'] }) // invalidate for current client + additonal clients
          setNotificationMessage('Client updated successfully')
        }}
        deletedClient={async () => {
          await queryClient.invalidateQueries({ queryKey: ['clients'] })
          await queryClient.invalidateQueries({ queryKey: ['projects'] })
          await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] }) //invalidate for every semester the clients proproject is in if no need for backend call
          await queryClient.invalidateQueries({ queryKey: ['clientProjects'] }) //invalidate for current client + additional clients
          setNotificationMessage('Client deleted successfully')
        }}
        onDeleteProject={handleDeleteProject}
        deletedProject={async () => {
          await queryClient.invalidateQueries({ queryKey: ['projects'] })
          await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] })
          setNotificationMessage('Project deleted successfully')
        }}
        useClients={useClients}
        useClientProjects={useClientProjects}
      />
    </Suspense>
  )
}
export default AdminClientView
