import { z } from "zod";

export const CreateSemesterRequestBody = z.object({
  name: z.string(),
  description: z.string().optional(),
  deadline: z.string().refine(val => !isNaN(Date.parse(val))),
  startDate: z.string().refine(val => !isNaN(Date.parse(val))),
  endDate: z.string().refine(val => !isNaN(Date.parse(val))),
});
