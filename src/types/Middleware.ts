import z from 'zod'
import { ClientCombinedInfoSchema } from './Payload'

export const JWTResponseSchema = z.object({
  user: ClientCombinedInfoSchema,
  accessToken: z.string().optional(),
})

export type JWTResponse = z.infer<typeof JWTResponseSchema>
