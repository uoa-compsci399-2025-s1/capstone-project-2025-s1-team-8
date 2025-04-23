import { z } from 'zod'
import { UserRole } from './User'
import { ClientAdditionalInfo, Media, Project, Semester, User } from '@/payload-types'

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
}) satisfies z.ZodType<Media>;

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  email: z.string().email(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpiration: z.string().optional(),
  salt: z.string().optional(),
  hash: z.string().optional(),
  lockUntil: z.string().optional(),
  password: z.string().optional(),
}) satisfies z.ZodType<User>

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  clients: z.array(z.union([z.string(), UserSchema])),
  description: z.string(),
  attachments: z.array(z.union([z.string(), MediaSchema])).optional(),
  deadline: z.string().nullable(),
  timestamp: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Project>;

export const SemesterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Semester>;

export const ClientAdditionalInfoSchema = z.object({
  id: z.string(),
  client: z.union([z.string(), UserSchema]),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<ClientAdditionalInfo>
