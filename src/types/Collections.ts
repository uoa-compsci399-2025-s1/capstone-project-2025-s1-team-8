import { Semester, SemesterProject, User, Project } from '@/payload-types'

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

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
*Project Collection Types
*/
export type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProjectData = Partial<CreateProjectData>
