import type { Access } from 'payload'

import { checkRole } from './checkRole'
/*
*This file contains the access control for the client role
*It checks if the user has the client role and returns true or false accordingly.
*The client role is used to restrict access to certain collections or fields in the CMS.
*@param req - The request object containing the user information.
*@param user - The user object containing the role information.
*@returns {boolean} - Returns true if the user has the client role, false otherwise.
*/
export const clientOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['client'], user)
}
