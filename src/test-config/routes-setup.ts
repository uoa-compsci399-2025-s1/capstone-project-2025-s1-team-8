import { clearCollection, testPayloadObject } from './utils'
import {
  ACCESS_TOKEN_MOCK,
  adminMock,
  clientMock,
  JWT_SECRET_MOCK,
  studentMock,
} from './mocks/Auth.mock'
import AuthService from '@/business-layer/services/AuthService'

let adminToken: string
let clientToken: string
let studentToken: string

beforeEach(async () => {
  const authService = new AuthService()
  adminToken = authService.generateJWT(adminMock, ACCESS_TOKEN_MOCK)
  clientToken = authService.generateJWT(clientMock, ACCESS_TOKEN_MOCK)
  studentToken = authService.generateJWT(studentMock, ACCESS_TOKEN_MOCK)
  process.env.JWT_SECRET = JWT_SECRET_MOCK
})

afterEach(async () => {
  await clearCollection(testPayloadObject, 'user')
  await clearCollection(testPayloadObject, 'authentication')
  await clearCollection(testPayloadObject, 'clientAdditionalInfo')
  await clearCollection(testPayloadObject, 'semester')
  await clearCollection(testPayloadObject, 'semesterProject')
  await clearCollection(testPayloadObject, 'form')
  await clearCollection(testPayloadObject, 'project')
  await clearCollection(testPayloadObject, 'formQuestion')
  await clearCollection(testPayloadObject, 'formResponse')
})

export { adminToken, clientToken, studentToken }
