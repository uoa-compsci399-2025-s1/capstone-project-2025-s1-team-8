import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedFormView from '@/components/Pages/FormPage/ProtectedFormView'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Project Form',
  description: 'Create and manage projects with ease',
}

export default function Form({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <Suspense
        fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}
      >
        <ProtectedFormView 
          searchParams={searchParams}
        />
      </Suspense>
    </AuthWrapper>
  )
}
