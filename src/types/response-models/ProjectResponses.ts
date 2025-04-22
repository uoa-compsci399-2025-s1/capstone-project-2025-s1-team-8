import { z } from 'zod'

import { Project } from '@/payload-types'
import { CommonResponse } from './CommonResponse'

export const GetProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const PostProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const PatchProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>

export type PostProjectReponse = z.infer<typeof PostProjectResponseSchema>

export type PatchProjectResponse = z.infer<typeof PatchProjectResponseSchema>
