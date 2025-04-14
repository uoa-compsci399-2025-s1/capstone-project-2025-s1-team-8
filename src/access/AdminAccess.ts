import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const adminOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['admin'], user)
}
