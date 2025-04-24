import { StatusCodes } from 'http-status-codes'

import { GET } from './route'
import { createMockNextRequest, mockToken } from '@/test-config/utils'

describe('/api/auth/logout', () => {
  it('should delete auth cookie', async () => {
    vi.mock('next/headers', () => ({
      cookies: vi.fn(() => ({
        get: vi.fn(() => {
          return { value: mockToken('client') }
        }),
        delete: vi.fn(),
      })),
    }))
    const req = createMockNextRequest('/api/auth/logout')
    const res = await GET(req)
    expect(res.status).toBe(StatusCodes.OK)
  })
})
