import { clearCollection } from './utils'
import {
  ACCESS_TOKEN_MOCK,
  ADMIN_JWT_MOCK,
  adminMock,
  CLIENT_JWT_MOCK,
  clientMock,
  JWT_SECRET_MOCK,
  STUDENT_JWT_MOCK,
  studentMock,
} from './mocks/Auth.mock'
import AuthService from '@/business-layer/services/AuthService'
import { payload } from '@/data-layer/adapters/Payload'
import { CollectionSlug } from 'payload'

let adminToken: string
let clientToken: string
let studentToken: string

let cookies: Record<string, string> = {}

beforeEach(async () => {
  // Need to mock the auth service decode for it to decode the correct mocks
  vi.mock('@/business-layer/services/AuthService', () => {
    return {
      default: class {
        hashPassword = vi.fn().mockImplementation((password) => {
          return Buffer.from(password).toString('base64')
        })
        verifyPassword = vi.fn().mockImplementation((password, hash) => {
          return Buffer.from(hash, 'base64').toString() === password
        })
        generateJWT = vi.fn().mockImplementation((user, _token) => {
          if (user === adminMock || user.email === adminMock.email) return ADMIN_JWT_MOCK
          if (user === clientMock || user.email === clientMock.email) return CLIENT_JWT_MOCK
          if (user === studentMock || user.email === studentMock.email) return STUDENT_JWT_MOCK
          return ''
        })
        decodeJWT = vi.fn().mockImplementation((token) => {
          if (token === ADMIN_JWT_MOCK) return { user: adminMock, accessToken: ACCESS_TOKEN_MOCK }
          if (token === CLIENT_JWT_MOCK) return { user: clientMock, accessToken: ACCESS_TOKEN_MOCK }
          if (token === STUDENT_JWT_MOCK)
            return { user: studentMock, accessToken: ACCESS_TOKEN_MOCK }
          return null
        })
      },
    }
  })

  vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
      set: (key: string, value: string) => {
        cookies[key] = value
      },
      get: (key: string) => {
        return { value: cookies[key] }
      },
      delete: (key: string) => {
        delete cookies[key]
      },
    })),
  }))

  const authService = new AuthService()
  process.env.JWT_SECRET = JWT_SECRET_MOCK
  adminToken = authService.generateJWT(adminMock, ACCESS_TOKEN_MOCK)
  clientToken = authService.generateJWT(clientMock, ACCESS_TOKEN_MOCK)
  studentToken = authService.generateJWT(studentMock, ACCESS_TOKEN_MOCK)
  await payload.create({
    collection: 'user',
    data: adminMock,
  })
  await payload.create({
    collection: 'user',
    data: clientMock,
  })
  await payload.create({
    collection: 'user',
    data: studentMock,
  })
})

afterEach(async () => {
  for (const slug of Object.keys(payload.collections)) {
    await clearCollection(payload, slug as CollectionSlug)
  }
  cookies = {}
})

export { adminToken, clientToken, studentToken }
