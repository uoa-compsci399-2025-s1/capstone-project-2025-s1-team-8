'use server'
import Admin from './admin'
import AdminProjectService from '@/lib/services/admin/AdminProjectService'

export default async function AdminPage() {
  const { data } = await AdminProjectService.getNextSemesterProjects()
  return (
    <>
      <Admin ProjectData={data} />
    </>
  )
}

//Still to do:
//error handling and unauthorised rerouting to error page
//Edit button for projects
//Removing all extra fields if not filled in - project modal
//Updating using save button
