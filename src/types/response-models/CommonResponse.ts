import { z } from 'zod'

export const CommonResponse = z.object({
  /**
   * Any possible error that the response gives
   * @example No scope
   */
  error: z.string().optional(),
  /**
   * Any non-error informational message by the route
   * @example Account created
   */
  message: z.string().optional(),
})
