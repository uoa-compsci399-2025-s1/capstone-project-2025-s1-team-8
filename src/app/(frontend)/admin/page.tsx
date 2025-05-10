'use server'
import Admin from './admin'
import { getNextSemesterProjects } from '@/lib/services/admin/AdminProjectService'

export default async function AdminPage() {
  const { data } = await getNextSemesterProjects()
  return (
    <>
      <Admin ProjectData={data} />
    </>
  )
}

//Still to do:
//error handling and unauthorised rerouting to error page
//Edit button for projects
//Removing all extra fields if not filled in
//Updating using save button
