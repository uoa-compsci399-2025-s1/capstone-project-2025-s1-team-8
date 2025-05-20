import React from 'react'
import '@/app/(frontend)/globals.css'

export const metadata = {
  description: 'Connecting Computer Science Students with Innovative Projects',
  title: 'Encapsulate',
  icons: {
    icon: [
      { url: '/dark-logo.png', media: '(prefers-color-scheme: light)' },
      { url: '/light-logo.png', media: '(prefers-color-scheme: dark)' },
    ],
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
