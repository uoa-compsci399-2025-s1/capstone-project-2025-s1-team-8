import jwt from 'jsonwebtoken'

import AuthService from './AuthService'
import { ACCESS_TOKEN_MOCK, CLIENT_JWT_MOCK, clientMock } from '@/test-config/mocks/Auth.mock'

describe('Auth service tests', () => {
  const authService = new AuthService()

  beforeEach(()=>{
    vi.mock('jsonwebtoken', () => ({
      default: {
        verify: vi.fn().mockImplementation((token) => {
          if (token === CLIENT_JWT_MOCK) return { user: clientMock, accessToken: ACCESS_TOKEN_MOCK }
          return null
        }),
      },
    }))
  })

  afterEach(()=>{
    vi.clearAllMocks()
  })

  it('should generate a JWT token for the given user and access token', () => {
    const token = authService.generateJWT(clientMock, ACCESS_TOKEN_MOCK)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    expect(decoded).toMatchObject({
      user: clientMock,
      accessToken: ACCESS_TOKEN_MOCK,
    })
  })

  it('should decode a JWT token and return the payload', () => {
    const token = authService.generateJWT(clientMock, ACCESS_TOKEN_MOCK)
    const decoded = authService.decodeJWT(token)
    expect(decoded).toMatchObject({
      user: clientMock,
      accessToken: ACCESS_TOKEN_MOCK,
    })
  })
})
