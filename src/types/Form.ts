import { z } from 'zod';

import { QuestionResponseSchema } from './Payload';

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
