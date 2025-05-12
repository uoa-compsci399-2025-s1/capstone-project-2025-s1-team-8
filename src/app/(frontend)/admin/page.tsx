'use server'
import Admin from './admin'
import AdminService from '@/lib/services/admin'

export default async function AdminPage() {
  const { data } = await AdminService.getAllUsers()
  console.log(data)
  return (
    <>
      <Admin ClientData={data} />
      {data && <p>{data}</p>}
    </>
  )
}

//Still to do:
//error handling and unauthorised rerouting to error page
//Edit button for projects
//Removing all extra fields if not filled in - project modal
//Updating using save button