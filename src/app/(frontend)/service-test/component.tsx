import ClientService from '@/lib/services/admin/client/ClientService'

export default async function Component() {
  const data = await ClientService.getAllUsers()
  const data2 = await ClientService.getUserById('6810473c0497f84b9c5c31df')
  const data3 = await ClientService.updateUser('6810473c0497f84b9c5c31df', { email: 'liv.brown@example.com', })
  const data4 = await ClientService.deleteUser('6810473c0497f84b9c5c31df')
  const data5 = await ClientService.getProjectsByUserId('681046eb0497f84b9c5c31b3')
  return <div>
    {JSON.stringify(data)}
    {JSON.stringify(data2)}
    {JSON.stringify(data3)}
    {JSON.stringify(data4)}
    {JSON.stringify(data5)}
  </div>
}
