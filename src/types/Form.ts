import type { z } from 'zod'

import type { QuestionResponseSchema } from './Payload'

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>
