import { z } from 'zod'

import type { Semester } from '@/payload-types'
import { CommonResponse } from './CommonResponse'

export const GetSemesterResponseSchema = CommonResponse.extend({
  data: z.custom<Semester>().optional(),
})

export type GetSemesterResponse = z.infer<typeof GetSemesterResponseSchema>
