import {
  Semester,
  SemesterProject,
  User,
  FormQuestion,
  Project,
  FormResponse,
} from '@/payload-types'

/*
 * Semester Collection Types
 */
export type CreateSemesterData = Omit<Semester, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSemesterData = Partial<CreateSemesterData>

/*
 * Form Question Collection Types
 */
export type CreateFormQuestionData = Omit<FormQuestion, 'createdAt' | 'updatedAt' | 'id'>
export type UpdateFormQuestionData = Partial<CreateFormQuestionData>
/*
 * Semester Project Collection Types
 */
export type CreateSemesterProjectData = Omit<SemesterProject, 'id' | 'createdAt' | 'updatedAt'>

/*
 *Project Collection Types
 */
export type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProjectData = Partial<CreateProjectData>

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
export type CreateFormResponseData = Omit<FormResponse, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateFormResponseData = Partial<CreateFormResponseData>
