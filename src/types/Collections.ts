import { Media, Semester, User } from '@/payload-types'

/*
 * Semester Collection Types
 */
export type CreateSemesterData = Omit<Semester, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSemesterData = Partial<CreateSemesterData>

/*
 * User Collection Types
 */
export type CreateUserData = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'loginAttempts'
  | 'lockUntil'
  | 'salt'
  | 'hash'
  | 'resetPasswordToken'
  | 'resetPasswordExpiration'
>
export type UpdateUserData = Partial<CreateUserData>
