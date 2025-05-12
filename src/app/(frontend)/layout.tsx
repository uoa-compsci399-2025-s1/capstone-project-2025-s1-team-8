import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Connecting Computer Science Students with Innovative Projects',
  title: 'Encapsulate',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return <div>{children}</div>
}
