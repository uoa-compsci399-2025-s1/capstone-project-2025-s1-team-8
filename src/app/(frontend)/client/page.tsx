import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedClientView from '@/components/Pages/ClientDashboard/ProtectedClientView'

export const metadata: Metadata = {
  description: 'Client dashboard - manage and submit projects!',
  title: 'Client Dashboard',
}

export default async function ClientPage() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
        <ProtectedClientView />
    </AuthWrapper>
  )
}
