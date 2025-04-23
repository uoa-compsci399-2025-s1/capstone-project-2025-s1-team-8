import { z } from 'zod'

export const UpdateUserRequestBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'client', 'student']).optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  email: z.string().optional(),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
})
