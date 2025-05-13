'use server'
import Admin from './admin'
import AdminService from '@/lib/services/admin'

export default async function AdminPage() {
  const { data } = await AdminService.getAllUsers()
  // For each client, fetch their projects
  const clientsWithProjects = await Promise.all(
    data.map(async (client) => {
      const projects = await AdminService.getProjectsByUserId(client.id)
      return {
        client,
        projects,
      }
    })
  )
  console.log(clientsWithProjects)

  return (
    <>
      <Admin ClientData={clientsWithProjects} />
    </>
  )
}

//Still to do:
//error handling and unauthorised rerouting to error page
//Edit button for projects
//Removing all extra fields if not filled in - project modal
//Updating using save button
