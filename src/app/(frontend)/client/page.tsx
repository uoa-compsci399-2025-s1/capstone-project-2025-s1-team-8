import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedClientView from './ProtectedClientView'

export default async function ClientPage() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <ProtectedClientView />
    </AuthWrapper>
  )
}
