import { z } from 'zod'
import { Project } from '@/payload-types'
import { CommonResponse } from './CommonResponse'
import { UserCombinedInfo } from '../Collections'

export const GetUserResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>
  