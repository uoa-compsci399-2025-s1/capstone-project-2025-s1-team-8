import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedAdminView from '@/components/Pages/AdminDashboard/ProtectedAdminView'
import { Suspense } from 'react'

export const metadata: Metadata = {
  description: 'Admin dashboard - manage users, projects, semesters, and more.',
  title: 'Admin Dashboard',
}

const AdminPage = () => {
  return (
    <AuthWrapper scopes={['admin']}>
      <Suspense fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}>
        <ProtectedAdminView />
      </Suspense>
    </AuthWrapper>
  )
}

export default AdminPage
