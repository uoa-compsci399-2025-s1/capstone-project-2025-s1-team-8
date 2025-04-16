import { CreateUserData } from '@/types/Collections'
import { UserRole } from '@/types/User'

export const adminCreateMock: CreateUserData = {
  role: UserRole.Admin,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'abcdefg',
}

export const clientCreateMock: CreateUserData = {
  role: UserRole.Client,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'abcdefg',
}

export const studentCreateMock: CreateUserData = {
  role: UserRole.Student,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'abcdefg',
}
