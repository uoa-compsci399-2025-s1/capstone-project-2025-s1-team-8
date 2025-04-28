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
      <div className="flex flex-col items-center justify-center gap-12 mx-6 my-6 w-[80vw] pt-24">
        <ClientDashboard client={mockClient} projects={mockProjects} />
      </div>
    </div>
  )
}
