import { cookies } from 'next/headers'

import { studentToken } from '@/test-config/routes-setup'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { GET } from './route'
import { createMockNextRequest, paramsToPromise } from '@/test-config/utils'

describe('tests /api/form/responses/[id]', async () => {
  const cookieStore = await cookies()

  describe('GET /api/form/responses/[id]', () => {
    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('/api/form/responses/123'), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(401)
    })
  })
})
