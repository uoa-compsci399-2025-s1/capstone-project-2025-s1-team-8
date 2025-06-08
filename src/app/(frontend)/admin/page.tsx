import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedAdminView from '@/components/Pages/AdminDashboard/ProtectedAdminView'

export const metadata: Metadata = {
  description: 'Admin dashboard - manage users, projects, semesters, and more.',
  title: 'Admin Dashboard',
}

const AdminPage = () => {
  return (
    <AuthWrapper scopes={['admin']}>
      <ProtectedAdminView />
    </AuthWrapper>
  )
}

export default AdminPage
