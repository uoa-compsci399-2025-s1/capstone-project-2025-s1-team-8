import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedFormView from '@/components/Pages/FormPage/ProtectedFormView'

export const metadata: Metadata = {
  description: 'Create and manage projects with ease',
  title: 'Project Form',
}

export default function Form() {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <ProtectedFormView />
    </AuthWrapper>
  )
}
