import { CreateUserData } from '@/types/collections'
import { UserRole } from '@/types/user'

export const userCreateMock: CreateUserData = {
  role: UserRole.Admin,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'abcdefg',
}
