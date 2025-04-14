import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const studentOnly: Access = ({ req: { user } }): boolean => {
  if (!user) return false
  return checkRole(['student'], user)
}
