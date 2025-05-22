import React from 'react'
import '@/app/(frontend)/globals.css'

export const metadata = {
  description: 'Connecting Computer Science Students with Innovative Projects',
  title: 'Encapsulate',
  icons: {
    icon: [{ url: '/favicon.png' }],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
