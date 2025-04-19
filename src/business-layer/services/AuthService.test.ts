import jwt from 'jsonwebtoken'

import { mockClient1 } from '@/test-config/mocks/User.mock'
import AuthService from './AuthService'
import { ACCESS_TOKEN_MOCK, JWT_SECRET_MOCK } from '@/test-config/mocks/Auth.mock'

describe('Auth service tests', () => {
  const authService = new AuthService()

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET_MOCK
  })

  it('should generate a JWT token for the given user and access token', () => {
    const token = authService.generateJWT(mockClient1, ACCESS_TOKEN_MOCK)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    expect(decoded).toMatchObject({
      profile: mockClient1,
      accessToken: ACCESS_TOKEN_MOCK,
    })
  })

  it('should decode a JWT token and return the payload', () => {
    const token = authService.generateJWT(mockClient1, ACCESS_TOKEN_MOCK)
    const decoded = authService.decodeJWT(token)
    expect(decoded).toMatchObject({
      profile: mockClient1,
      accessToken: ACCESS_TOKEN_MOCK,
    })
  })
})
