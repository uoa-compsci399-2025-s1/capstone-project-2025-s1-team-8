import AdminClientService from './AdminClientService'
import AdminSemesterService from './AdminSemesterService'
import AdminProjectService from './AdminProjectService'

const AdminService = {
  ...AdminClientService,
  ...AdminSemesterService,
  ...AdminProjectService,
}

export default AdminService
