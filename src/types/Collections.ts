import { Semester, User } from '@/payload-types'

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

/*
 * Semester Collection Types
 */
export type CreateSemesterData = Omit<Semester, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSemesterData = Partial<CreateSemesterData>
