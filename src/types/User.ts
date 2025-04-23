import { z } from 'zod';
import { MediaSchema } from './request-models/ProjectRequests';

export enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Student = 'student',
}

// Payload User type
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
