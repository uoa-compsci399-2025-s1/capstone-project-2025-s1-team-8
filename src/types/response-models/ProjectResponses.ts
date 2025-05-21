import { z } from 'zod'

import type { Project, SemesterProject } from '@/payload-types'
import { CommonResponse } from './CommonResponse'

export const GetProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const GetAllProjectsResponseSchema = CommonResponse.extend({
  data: z.array(z.custom<Project>()),
  nextPage: z.number().nullable(),
})
export const PostProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const PatchProjectResponseSchema = CommonResponse.extend({
  data: z.custom<Project>().optional(),
})

export const GetAllSemesterProjectResponseSchema = CommonResponse.extend({
  data: z.array(z.custom<SemesterProject>()),
  nextPage: z.number().nullable(),
})

export const GetSemesterProjectResponseSchema = CommonResponse.extend({
  data: z.custom<SemesterProject>().optional(),
})

export const PatchSemesterProjectSchema = CommonResponse.extend({
  data: z.custom<SemesterProject>().optional(),
})

export const PostSemesterProjectResponseSchema = CommonResponse.extend({
  data: z.custom<SemesterProject>().optional(),
})

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>
export type PostProjectResponse = z.infer<typeof PostProjectResponseSchema>
export type PatchProjectResponse = z.infer<typeof PatchProjectResponseSchema>
export type GetAllProjectsResponse = z.infer<typeof GetAllProjectsResponseSchema>
export type PatchSemesterProjectResponse = z.infer<typeof PatchSemesterProjectSchema>
export type GetAllSemesterProjectResponse = z.infer<typeof GetAllSemesterProjectResponseSchema>
export type GetSemesterProjectResponse = z.infer<typeof GetSemesterProjectResponseSchema>
export type PostSemesterProjectResponse = z.infer<typeof PostSemesterProjectResponseSchema>
