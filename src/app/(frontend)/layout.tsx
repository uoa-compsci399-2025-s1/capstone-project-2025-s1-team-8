import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  description: 'Connecting Computer Science Students with Innovative Projects',
  title: 'Home',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return <div>{children}</div>
}
