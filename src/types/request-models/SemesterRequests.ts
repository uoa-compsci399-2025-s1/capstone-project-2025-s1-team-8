import { z } from 'zod'

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
})
