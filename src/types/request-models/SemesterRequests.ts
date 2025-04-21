import { z } from 'zod'

export const UpdateSemesterRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  
export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format, should be in ISO 8601 format',
  }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format, should be in ISO 8601 format',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format, should be in ISO 8601 format',
  }),
})
