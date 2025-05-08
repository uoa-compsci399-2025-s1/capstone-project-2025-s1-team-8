import React from 'react'
import '../globals.css'
import AdminMobileView from './adminMobileView'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function AdminLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          {children}
          <AdminMobileView />
        </main>
      </body>
    </html>
  )
}
