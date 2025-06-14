import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedStudentView from '@/components/Pages/StudentDashboard/ProtectedStudentView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Dashboard',
  description: 'View and manage published projects',
}

export default function StudentPage() {
  return (
    <AuthWrapper scopes={['admin', 'student']}>
      <ProtectedStudentView />
    </AuthWrapper>
  )
}
