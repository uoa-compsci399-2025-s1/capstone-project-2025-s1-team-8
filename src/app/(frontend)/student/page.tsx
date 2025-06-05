import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedStudentView from '@/components/Pages/StudentDashboard/ProtectedStudentView'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Student Dashboard',
  description: 'View and manage published projects',
}

export default function StudentPage() {
  return (
    <AuthWrapper scopes={['admin', 'student']}>
      <Suspense fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}>
        <ProtectedStudentView />
      </Suspense>
    </AuthWrapper>
  )
}
