import AdminClientService from './AdminClientService'
import OtherClientService from './AdminSemesterService'

const AdminService = {
  ...AdminClientService,
  ...OtherClientService,
}

export default AdminService
