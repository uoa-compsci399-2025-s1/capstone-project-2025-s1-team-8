'use client'
import ProjectCardList from '@/components/Composite/ProjectCardList/ProjectCardList'
import NavBar from '@/components/Generic/NavBar/NavBar'
import { handleStudentPageLoad } from '@/lib/services/student/Handlers'
import { ProjectDetails } from '@/types/Project'
import { useEffect, useState } from 'react'
import NoProjects from './noProjects'
import { UserCombinedInfo } from '@/types/Collections'
import { getLoggedInUser } from '@/lib/services/user/Handlers'
import { UserRole } from '@/types/User'
import { redirect } from 'next/navigation'

export default function Student() {
  const [projects, setProjects] = useState<ProjectDetails[]>([])
  const [semesterName, setSemesterName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [hasProjects, setHasProjects] = useState<boolean>(false)
  const [loggedInUser, setLoggedInUser] = useState<UserCombinedInfo>({} as UserCombinedInfo)
  const [loginLoaded, setLoginLoaded] = useState<boolean>(false)

  useEffect(() => {
    handleStudentPageLoad().then((res) => {
      setSemesterName(res.name)
      setProjects(res.projects)
      if (res.projects.length > 0) {
        setHasProjects(true)
      }
      setLoading(false)
    })
    getLoggedInUser().then((res) => {
        setLoggedInUser(res)
        setLoginLoaded(true)
    })
  }, [])

  if (loading || !loginLoaded) return null
  if (!loggedInUser || (loggedInUser.role !== UserRole.Student && loggedInUser.role !== UserRole.Admin)) {
    redirect('not-found')
  }

  return (
    <div>
      <NavBar user={loggedInUser} />
      <div className="pt-30">
        <div className="px-[10%]">
        {hasProjects && (<ProjectCardList
          className="bg-muted-blue-op-45 px-[10%] px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border"
          headingClassName="text-xl sm:text-2xl py-4 sm:py-6"
          heading={semesterName}
          projects={projects}
        />)}
        </div>
        {!hasProjects && (
          <NoProjects/>
        )}
      </div>
    </div>
  )
}
