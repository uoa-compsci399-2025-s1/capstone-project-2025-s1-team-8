import AdminClientService from './AdminClientService'
import AdminSemesterService from './AdminSemesterService'

const AdminService = {
  ...AdminClientService,
  ...AdminSemesterService,
}

export default AdminService
