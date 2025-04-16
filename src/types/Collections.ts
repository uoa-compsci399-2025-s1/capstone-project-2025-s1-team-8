import { Semester, SemesterProject, User, Form } from '@/payload-types'

/*
 * Semester Collection Types
 */
export type CreateSemesterData = Omit<Semester, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSemesterData = Partial<CreateSemesterData>

/*
 * Semester Project Collection Types
 */
export type CreateSemesterProjectData = Omit<SemesterProject, 'id' | 'createdAt' | 'updatedAt'>

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

/*
 * Form Collection Types
 */
export type CreateFormData = Omit<Form, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateFormData = Partial<CreateFormData>
