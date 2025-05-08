import { CreateClientAdditionalInfoData, CreateUserData } from '@/types/Collections'
import { UserRole } from '@/types/User'

export const adminCreateMock: CreateUserData = {
  role: UserRole.Admin,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoeadmin@gmail.com',
}

export const clientCreateMock: CreateUserData = {
  role: UserRole.Client,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoeclient@gmail.com',
}

export const studentCreateMock: CreateUserData = {
  role: UserRole.Student,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoestudent@gmail.com',
}

export const clientAdditionalInfoCreateMock: CreateClientAdditionalInfoData = {
  client: '67fdc27019dd81b68db9bb64',
  introduction: "Hello i'm a very cool client. My project cool.",
  affiliation: 'Very cool company',
}
