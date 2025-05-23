import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedAdminView from '@/components/Pages/AdminDashboard/ProtectedAdminView'

const AdminPage = () => {
  return (
    <AuthWrapper scopes={['admin']}>
      <ProtectedAdminView />
    </AuthWrapper>
  )
}

export default AdminPage
