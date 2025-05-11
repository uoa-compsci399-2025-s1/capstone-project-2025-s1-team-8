'use client'

import NavBar from '@/components/Generic/NavBar/NavBar'
import ClientDashboard from '@/components/Pages/ClientDashboard/ClientDashboard'
import { useState, useEffect } from 'react'
import { handleClientPageLoad } from '@/lib/util/util'
import { UserCombinedInfo } from '@/types/Collections'
import { Project } from '@/payload-types'
import { Semester } from '@/payload-types'
import { handleLoginButtonClick, isLoggedIn } from '@/lib/services/user/Handlers'

export default function Client() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [user, setUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [projects, setProjects] = useState<Project[]>([])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)
  const [semesters, setSemesters] = useState<Semester[][]>([])

  useEffect(() => {
    handleClientPageLoad().then((res) => {
      setUser(res.userInfo)
      setProjects(res.projects)
      setSemesters([] as Semester[][])
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
  // Empty array for now, once endpoint is done replace with respective service
  for (let i = 0; i < projects.length; i++) {
    semesters.push([] as Semester[])
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
        <ClientDashboard client={user} projects={projects} semesters={semesters} />
      </div>
    </div>
  )
}
