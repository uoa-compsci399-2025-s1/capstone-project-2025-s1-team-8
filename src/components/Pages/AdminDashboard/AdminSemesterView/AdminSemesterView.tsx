import SemestersPage from '../../SemestersPage/SemestersPage'
import { useQueryClient } from '@tanstack/react-query'
import { useSemesters } from '@/lib/hooks/useSemesters'
import SemesterCardSkeleton from '@/components/Generic/SemesterCardSkeleton/SemesterCardSkeleton'
import {
  handleCreateSemester,
  handleDeleteProject,
  handleDeleteSemester,
  handleUpdateSemester,
} from '@/lib/services/admin/Handlers'
import { useSemesterProjects } from '@/lib/hooks/useSemesterProjects'

interface IAdminSemesterView {
  /**
   * Function used to set the notification message
   */
  setNotificationMessage: (message: string) => void
}

const AdminSemesterView = ({ setNotificationMessage }: IAdminSemesterView) => {
  const queryClient = useQueryClient()
  const { data: semestersData, isLoading: isSemestersLoading } = useSemesters()

  return (
    <>
      {isSemestersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SemesterCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <SemestersPage
          semesters={semestersData?.data || []}
          createdSemester={async () => {
            await queryClient.invalidateQueries({ queryKey: ['semesters'] })
            await queryClient.invalidateQueries({ queryKey: ['studentPage'] })
            setNotificationMessage('Semester created successfully')
          }}
          updatedSemester={async () => {
            //done
            await queryClient.invalidateQueries({ queryKey: ['semesters'] })
            await queryClient.invalidateQueries({ queryKey: ['projects'] })
            await queryClient.invalidateQueries({ queryKey: ['clientProjects'] })
            await queryClient.invalidateQueries({ queryKey: ['studentPage'] })
            setNotificationMessage('Semester updated successfully')
          }}
          handleCreateSemester={handleCreateSemester}
          handleUpdateSemester={handleUpdateSemester}
          handleDeleteSemester={handleDeleteSemester}
          deletedSemester={async () => {
            //done
            await queryClient.invalidateQueries({ queryKey: ['semesters'] })
            await queryClient.invalidateQueries({ queryKey: ['projects'] })
            await queryClient.invalidateQueries({ queryKey: ['clientProjects'] })
            setNotificationMessage('Semester deleted successfully')
          }}
          semesterStatuses={semestersData?.semesterStatuses || {}}
          onDeleteProject={handleDeleteProject}
          deletedProject={async () => {
            //done
            await queryClient.invalidateQueries({ queryKey: ['projects'] })
            await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] })
            setNotificationMessage('Project deleted successfully')
          }}
          useSemesterProjects={useSemesterProjects}
        />
      )}
    </>
  )
}

export default AdminSemesterView
