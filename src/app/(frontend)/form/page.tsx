import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedFormView from '@/components/Pages/FormPage/ProtectedFormView'

export const metadata: Metadata = {
  title: 'Project Form',
  description: 'Create and manage projects with ease',
}

export default function Form() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <ProtectedFormView />
    </AuthWrapper>
  )
}
