'use server'
import Admin from './admin'
import AdminService from '@/lib/services/admin'

export default async function AdminPage() {
  const getClientsResponse = await AdminService.getAllUsers()
  // For each client, fetch their projects
  const clientsWithProjects = await Promise.all(
    getClientsResponse.data.map(async (client) => {
      const projectsResponse = await AdminService.getProjectsByUserId(client.id)
      return {
        client,
        projects: projectsResponse.data,
      }
    }),
  )

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
