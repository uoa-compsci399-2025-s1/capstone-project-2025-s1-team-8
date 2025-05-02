import { z } from 'zod'

import {
  ClientAdditionalInfo,
  Form,
  FormQuestion,
  FormResponse,
  Media,
  Project,
  Semester,
  SemesterProject,
  User,
} from '@/payload-types'
import { UserRole } from './User'
import { ProjectStatus } from './Project'

export const MediaSchema = z.object({
  id: z.string(),
  alt: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  url: z.string().nullable().optional(),
  thumbnailURL: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  filesize: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  focalX: z.number().nullable().optional(),
  focalY: z.number().nullable().optional(),
}) satisfies z.ZodType<Media>

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  email: z.string().email(),
}) satisfies z.ZodType<User>

export const SemesterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Semester>

export const FormQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  description: z.string(),
  required: z.boolean(),
  fieldName: z.string(),
  order: z.number(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<FormQuestion>

// Note that this schema isn't a payload schema but required to be defined here as FormQuestionSchema is defined above
export const QuestionResponseSchema = z.object({
  question: z.union([z.string(), FormQuestionSchema]),
  answer: z.string(),
})

export const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Form>

export const FormResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  client: UserSchema,
  otherClients: z.array(z.union([UserSchema, z.string()])),
  questionResponses: z.array(QuestionResponseSchema),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<FormResponse>

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  clients: z.array(z.union([z.string(), UserSchema])),
  description: z.string(),
  attachments: z.array(z.union([z.string(), MediaSchema])).optional(),
  deadline: z.string().optional(),
  timestamp: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  formResponse: z.union([z.string(), FormResponseSchema]),
}) satisfies z.ZodType<Project>

export const SemesterProjectSchema = z.object({
  id: z.string(),
  number: z.number().optional(),
  semester: z.union([z.string(), SemesterSchema]),
  project: z.union([z.string(), ProjectSchema]),
  status: z.nativeEnum(ProjectStatus),
  published: z.boolean(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<SemesterProject>

export const ClientAdditionalInfoSchema = z.object({
  id: z.string(),
  client: z.union([z.string(), UserSchema]),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<ClientAdditionalInfo>

export const ClientCombinedInfo = UserSchema.merge(ClientAdditionalInfoSchema)
