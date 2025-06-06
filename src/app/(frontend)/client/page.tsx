import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedClientView from '@/components/Pages/ClientDashboard/ProtectedClientView'
import { Suspense } from 'react'

export const metadata: Metadata = {
  description: 'Client dashboard - manage and submit projects!',
  title: 'Client Dashboard',
}

export default async function ClientPage() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <Suspense
        fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}
      >
        <ProtectedClientView />
      </Suspense>
    </AuthWrapper>
  )
}
