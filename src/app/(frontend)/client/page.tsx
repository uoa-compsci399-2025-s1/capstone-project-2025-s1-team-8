'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import { mockClients } from '@/mocks/Clients.mock'
import { mockProjects } from '@/mocks/Projects.mock'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'

export default function Client() {
  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar navElements={[{ href: '/admin', text: 'My Dashboard' }]} />
      </div>
      <div className="items-center justify-center w-[90vw] pt-40 pb-30">
        <ClientDashboard client={mockClients[0]} projects={mockProjects} />
      </div>
    </div>
  )
}
