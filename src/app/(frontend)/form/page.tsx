import type { Metadata } from 'next'
import { AuthWrapper } from '@/components/Middleware/AuthWrapper'
import ProtectedFormView from '@/components/Pages/FormPage/ProtectedFormView'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Project Form',
  description: 'Create and manage projects with ease',
}

export default async function Form({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const resolvedSearchParams = await searchParams
  const projectId =
    typeof resolvedSearchParams?.projectId === 'string' ? resolvedSearchParams?.projectId : ''

  return (
    <AuthWrapper scopes={['admin', 'client']}>
      <Suspense
        fallback={<div className="text-center text-dark-blue text-lg pt-30">Loading...</div>}
      >
        <ProtectedFormView projectId={projectId} />
      </Suspense>
    </AuthWrapper>
  )
}
