import { User } from '@/payload-types'

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
