import { StatusCodes } from 'http-status-codes'

import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'

describe('/api/auth/logout', () => {
  it('should delete auth cookie', async () => {
    const req = createMockNextRequest('/api/auth/logout')
    const res = await GET(req)
    expect(res.status).toBe(StatusCodes.OK)
  })
})
