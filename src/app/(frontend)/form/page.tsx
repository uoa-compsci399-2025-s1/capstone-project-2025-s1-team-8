import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedFormView from '@/components/Pages/FormPage/ProtectedFormView'

export default function Form() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <ProtectedFormView />
    </AuthWrapper>
  )
}
