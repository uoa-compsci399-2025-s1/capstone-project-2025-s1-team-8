import { z } from 'zod'
import { UserRole } from './User'

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
})

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
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
})

export const ClientAdditionalInfo = z.object({
  id: z.string(),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
})
