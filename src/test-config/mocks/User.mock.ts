import { CreateUserData } from '@/types/Collections'
import { UserRole } from '@/types/User'
import { User } from '@/payload-types'

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

export const mockClient1: User = {
  id: '67ff38a56a35e1b6cf43a68b',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: UserRole.Client,
  firstName: 'Bob',
  lastName: 'Doe',
  email: 'bobdoe@gmail.com',
  password: 'abcdefg',
}
export const mockClient2: User = {
  id: '67ff38a56a35e1b6cf43a681',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: UserRole.Client,
  firstName: 'John',
  lastName: 'Doe',
  email: 'Johndoe@gmail.com',
  password: 'abcdefg',
}
export const studentCreateMock: CreateUserData = {
  role: UserRole.Student,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'abcdefg',
}
