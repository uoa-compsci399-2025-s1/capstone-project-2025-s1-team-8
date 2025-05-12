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
