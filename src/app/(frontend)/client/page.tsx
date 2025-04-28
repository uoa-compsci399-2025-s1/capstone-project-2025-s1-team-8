'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import { mockClient } from './mockClient'
import { mockProjects } from './mockProjects'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'

export default function Client() {
  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar />
      </div>
      <div className="items-center justify-center w-[90vw] pt-30 pb-15">
        <ClientDashboard client={mockClient} projects={mockProjects} />
      </div>
    </div>
  )
}
