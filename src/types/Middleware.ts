import z from 'zod'
import { ClientCombinedInfoSchema } from './Payload'

export const JWTResponseSchema = z.object({
  user: ClientCombinedInfoSchema,
  access_token: z.string(),
})

export type JWTResponse = z.infer<typeof JWTResponseSchema>
