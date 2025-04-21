import { z } from 'zod'

import { CommonResponse } from './CommonResponse'
import { UserCombinedInfo } from '../Collections'

export const GetAllUsersResponseSchema = CommonResponse.extend({
  data: z.custom<UserCombinedInfo>().optional(),
})

export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponseSchema>
