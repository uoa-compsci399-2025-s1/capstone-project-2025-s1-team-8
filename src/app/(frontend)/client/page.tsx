import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedClientView from '@/components/Pages/ClientDashboard/ProtectedClientView'

export default async function ClientPage() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <ProtectedClientView />
    </AuthWrapper>
  )
}
