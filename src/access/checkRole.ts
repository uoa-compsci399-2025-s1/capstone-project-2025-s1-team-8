import { User } from '@/payload-types'

export const checkRole = (roles: string[], user: User) => {
  if (user.role) {
    return roles.includes(user.role)
  }
  return false
}
