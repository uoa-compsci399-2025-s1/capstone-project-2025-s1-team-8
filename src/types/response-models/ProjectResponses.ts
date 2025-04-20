import { z } from 'zod'

import { Project } from '@/payload-types'
import { CommonResponse } from './CommonResponse'

export const GetProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const GetAllProjectsResponseSchema = CommonResponse.extend({
  data: z.array(z.custom<Project>()),
})

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>

export type GetAllProjectsResponse = z.infer<typeof GetAllProjectsResponseSchema>
