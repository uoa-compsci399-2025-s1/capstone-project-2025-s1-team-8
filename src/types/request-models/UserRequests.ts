import { z } from 'zod'
import { UserRole } from '../User'

export const UpdateUserRequestBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  email: z.string().optional(),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
})
