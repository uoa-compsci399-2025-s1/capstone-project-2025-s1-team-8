import jwt from 'jsonwebtoken'

import AuthService from './AuthService'
import { ACCESS_TOKEN_MOCK, CLIENT_JWT_MOCK, clientMock } from '@/test-config/mocks/Auth.mock'
import { UserRoleWithoutAdmin } from '@/types/User'

describe('Auth service tests', () => {
  const authService = new AuthService()

  beforeEach(() => {
    vi.mock('jsonwebtoken', () => ({
      default: {
        verify: vi.fn().mockImplementation((token) => {
          if (token === CLIENT_JWT_MOCK) return { user: clientMock, accessToken: ACCESS_TOKEN_MOCK }
          return null
        }),
      },
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateState', () => {
    it('should return a state with a custom role', () => {
      const state = authService.generateState(UserRoleWithoutAdmin.Client)
      expect(Buffer.from(state, 'base64').toString().split(';')[1]).toBe(
        UserRoleWithoutAdmin.Client,
      )

      const state2 = authService.generateState(UserRoleWithoutAdmin.Student)
      expect(Buffer.from(state2, 'base64').toString().split(';')[1]).toBe(
        UserRoleWithoutAdmin.Student,
      )
    })
  })

  describe('decryptState', () => {
    it('should decrypt a state correctly', () => {
      const state = authService.generateState(UserRoleWithoutAdmin.Client)
      expect(authService.decryptState(state)).toBe(UserRoleWithoutAdmin.Client)
    })
  })

  describe('standard auth tests', () => {
    it('should generate a hash that matches the expected value', async () => {
      const hash = await authService.hashPassword('password123456677387483874837')
      expect(hash).not.toEqual('password123456677387483874837')
      expect(await authService.verifyPassword('password123456677387483874837', hash)).toBeTruthy()
    })

    it('should return false when the password does not match', async () => {
      const hash = await authService.hashPassword('password123456677387483874837')
      expect(await authService.verifyPassword('wrongPassword', hash)).toBeFalsy()
    })
  })

  describe('JWT service method tests', () => {
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
})
