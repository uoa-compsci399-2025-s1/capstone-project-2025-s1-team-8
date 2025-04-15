import type { Access } from 'payload'
import { User } from '@/payload-types'

/**
 * This function checks if the user has one of the specified roles.
 * It returns true if the user has one of the roles, and false otherwise.
 *
 * @param roles An array of roles to check against.
 * @param user The user object containing the role information.
 * @returns Returns true if the user has one of the roles, false otherwise.
 */
export const checkRole = (roles: string[], user: User): boolean => roles.includes(user?.role)

/**
 * This function checks if the user has the admin role.
 *
 * @param param0 The request object containing the user information.
 * @returns Returns a boolean for the user having the admin role
 */
export const adminOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['admin'], user)
}

/**
 * This function checks if the user has the client role.
 *
 * @param param0 The request object containing the user information.
 * @returns Returns a boolean for the user having the client role
 */
export const clientOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['client'], user)
}

/**
 * This function checks if the user has the student role.
 *
 * @param param0 The request object containing the user information.
 * @returns Returns a boolean for the user having the student role
 */
export const studentOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['student'], user)
}

/**
 * Auth object for restricting only admin access
 */
export const adminOnlyAccess = {
  read: adminOnly,
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
}
