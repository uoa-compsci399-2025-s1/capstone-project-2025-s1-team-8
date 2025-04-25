import { z } from 'zod'

const FormQuestionRequest = z.object({
  question: z.string().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
})

export const UpdateFormRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(FormQuestionRequest).optional()
})