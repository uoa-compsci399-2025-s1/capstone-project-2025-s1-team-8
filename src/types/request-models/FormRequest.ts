import { z } from 'zod'

export const UpdateFormRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})
