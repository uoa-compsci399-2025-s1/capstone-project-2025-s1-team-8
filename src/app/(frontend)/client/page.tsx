'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'
import { useState, useEffect } from 'react'
import { handleClientPageLoad } from '@/lib/util/util'
import { UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'

export default function Client() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [user, setUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => {
    handleClientPageLoad().then((res) => {
      setIsLoaded(true)
      setUser(res.userInfo)
      setProjects(res.projects)
    })
  })
  if (!isLoaded) {
    return null
  }
  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar navElements={[{ href: '/client', text: 'My Dashboard' }]} />
      </div>
      <div className="items-center justify-center w-full px-8 sm:px-15 lg:px-30 pt-40 pb-20">
        <ClientDashboard client={user} projects={projects} />
      </div>
    </div>
  )
}
