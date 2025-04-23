import { z } from 'zod'
import { UserRole } from '../User'
import { MediaSchema } from '../Payload'

export const UserSchema = z
  .object({
    id: z.string(),
    updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    }),
    createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    }),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.nativeEnum(UserRole),
    image: MediaSchema.nullable().optional(),
  })
  .passthrough()

export const UpdateProjectRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  timestamp: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  clients: z
    .union([
      z.array(z.string()).nonempty('At least one client is required'),
      z.array(UserSchema).nonempty('At least one client is required'),
    ])
    .optional(),
  attachments: z.array(MediaSchema).max(5).optional(),
})

export const CreateProjectRequestBody = z.object({
  name: z.string(),
  description: z.string(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format, should be in ISO 8601 format',
    })
    .optional(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format, should be in ISO 8601 format',
  }),
  clients: z.union([
    z.array(z.string()).nonempty('At least one client is required'),
    z.array(UserSchema).nonempty('At least one client is required'),
  ]),
  attachments: z.array(MediaSchema).max(5).optional(),
})
