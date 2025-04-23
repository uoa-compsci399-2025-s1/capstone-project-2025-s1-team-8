import { z } from 'zod'

import { Project } from '@/payload-types'
import { CommonResponse } from './CommonResponse'

export const GetProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const GetAllProjectsResponseSchema = CommonResponse.extend({
  data: z.array(z.custom<Project>()),
  nextPage: z.number(),
})
export const PostProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const PatchProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>
export type PostProjectResponse = z.infer<typeof PostProjectResponseSchema>
export type PatchProjectResponse = z.infer<typeof PatchProjectResponseSchema>
export type GetAllProjectsResponse = z.infer<typeof GetAllProjectsResponseSchema>
