'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'
import { useState, useEffect } from 'react'
import { handleClientPageLoad } from '@/lib/services/client/Handlers'
import { UserCombinedInfo } from '@/types/Collections'
import { handleLoginButtonClick, isLoggedIn } from '@/lib/services/user/Handlers'
import { handleClientProfileUpdate } from '@/lib/services/client/Handlers'
import { ProjectWithSemesters } from '@/types/Project'

export default function Client() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [user, setUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [projects, setProjects] = useState<ProjectWithSemesters[]>([])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)

  useEffect(() => {
    handleClientPageLoad().then((res) => {
      setUser(res.userInfo)
      setProjects(res.projects)
      setIsLoaded(true)
    })
    isLoggedIn().then((res) => {
      setLoggedIn(res)
      setLoginLoaded(true)
    })
  }, [])

  if (!isLoaded || !loginLoaded) {
    return null
  }

  return (
    <div className="flex justify-center items-center">
      <div>
        <NavBar
          navElements={[{ href: '/client', text: 'My Dashboard' }]}
          loggedIn={loggedIn}
          onclick={handleLoginButtonClick}
        />
      </div>
      <div className="items-center justify-center w-full px-8 sm:px-15 lg:px-30 pt-40 pb-20">
        <ClientDashboard client={user} projects={projects} onSave={handleClientProfileUpdate} />
      </div>
    </div>
  )
}
