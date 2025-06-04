import type { Metadata } from 'next'
import React from 'react'
import '@/app/globals.css'

export const metadata: Metadata = {
  description: 'Connecting Computer Science Students with Innovative Projects',
  title: {
    template: '%s | Encapsulate',
    default: 'Encapsulate',
  },
  applicationName: 'Encapsulate',
  authors: [
    {
      name: 'Eric Zheng',
      url: 'https://www.linkedin.com/in/eric-zheng-nz/',
    },
    {
      name: 'JooHui Lee',
      url: 'https://www.linkedin.com/in/joohui-lee',
    },
    {
      name: 'Bethany Yates',
      url: 'https://www.linkedin.com/in/bethany-yates-9907651a9/',
    },
    {
      name: 'Dennis Hu',
      url: 'https://www.linkedin.com/in/dennishu811/',
    },
    {
      name: 'Sheena Lin',
      url: 'https://www.linkedin.com/in/enshean/',
    },
    {
      name: 'Jeffery Ji',
      url: 'https://www.linkedin.com/in/jefferyji/',
    },
  ],
  icons: '/favicon.png',
  openGraph: {
    title: 'Encapsulate',
    description: 'Connecting Computer Science Students with Innovative Projects',
    siteName: 'Encapsulate',
    images: `${process.env.NEXT_PUBLIC_URL}/favicon.png`,
    type: 'website',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
