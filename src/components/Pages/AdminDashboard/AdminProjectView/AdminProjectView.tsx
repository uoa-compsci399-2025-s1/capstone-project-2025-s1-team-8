import ProjectDnD from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import ProjectDnDSkeleton from '@/components/Generic/ProjectDNDSkeleton/ProjectDNDSkeleton'
import { useProjects } from '@/lib/hooks/useProjects'
import {
  updateProjectOrdersAndStatus,
  handleDeleteProject,
  handlePublishChanges,
} from '@/lib/services/admin/Handlers'
import { useQueryClient } from '@tanstack/react-query'

interface IAdminProjectView {
  /**
   * Function used to set the notification message
   */
  setNotificationMessage: (message: string) => void
}

const AdminProjectView = ({ setNotificationMessage }: IAdminProjectView) => {
  const queryClient = useQueryClient()
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects()

  return (
    <>
      {isProjectsLoading ? (
        <ProjectDnDSkeleton />
      ) : (
        <ProjectDnD
          key={JSON.stringify(projectsData?.presetContainers)}
          {...(projectsData || {
            semesterId: '',
            presetContainers: [],
          })}
          onSaveChanges={updateProjectOrdersAndStatus}
          onPublishChanges={handlePublishChanges}
          onDeleteProject={handleDeleteProject}
          deletedProject={async () => {
            setNotificationMessage('Project deleted successfully')
            await queryClient.invalidateQueries({ queryKey: ['projects'] })
            await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] }) // get current sem id and only do this form current sem
            await queryClient.invalidateQueries({ queryKey: ['studentPage'] })
          }}
        />
      )}
    </>
  )
}
export default AdminProjectView
