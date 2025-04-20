import { z } from 'zod'

export const CommonResponse = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
})
