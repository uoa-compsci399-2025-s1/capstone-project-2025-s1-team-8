import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedAdminView from '@/components/Pages/AdminDashboard/ProtectedAdminView'

export const metadata: Metadata = {
  description: 'Admin dashboard - manage users, projects, semesters, and more.',
  title: 'Admin Dashboard',
}

const AdminPage = () => {
  const pageParam = new URLSearchParams(window.location.search).get('page')
  const parsed = pageParam ? parseInt(pageParam, 10) : 1
  let cursor: number;
  if (isNaN(parsed)) {
    cursor = 1
  } else {
    cursor = parsed
  }
  return (
    <AuthWrapper scopes={['admin']}>
      <ProtectedAdminView cursor={cursor} />
    </AuthWrapper>
  )
}

export default AdminPage
