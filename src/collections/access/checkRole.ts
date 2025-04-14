import { User } from '@/payload-types'
/* 
  This function checks if the user has one of the specified roles.
  It returns true if the user has one of the roles, and false otherwise.
  @param {roles} - An array of roles to check against.
  @param {user} - The user object containing the role information.
*/
export const checkRole = (roles: string[], user: User): boolean => roles.includes(user?.role)
