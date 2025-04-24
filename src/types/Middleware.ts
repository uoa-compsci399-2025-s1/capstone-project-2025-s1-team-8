import z from 'zod'
import { ClientCombinedInfo } from './Payload'

export const JWTResponseSchema = z.object({
  user: ClientCombinedInfo,
  access_token: z.string(),
})

export type JWTResponse = z.infer<typeof JWTResponseSchema>
