import { Authentication, User } from '@/payload-types'
import { UserInfoResponse } from '@/types/Auth'
import { CreateAuthenticationData } from '@/types/Collections'
import { UserRole } from '@/types/User'

export const CODE_MOCK = 'coolcode'
export const STATE_MOCK = 'coolstate'
export const SCOPES_ARRAY_MOCK = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]
export const SCOPES_MOCK = encodeURIComponent(SCOPES_ARRAY_MOCK.join(' '))
export const REDIRECT_URI_MOCK = `https://accounts.google.com/o/oauth2/v2/auth?state=${STATE_MOCK}&scope=${SCOPES_MOCK}`

export const ACCESS_TOKEN_MOCK = 'access_token'
export const ID_TOKEN_MOCK = 'id_token'

export const JWT_SECRET_MOCK = 'jwt_secret'
export const JWT_MOCK = 'jwt_mock'

export const tokensMock = {
  access_token: ACCESS_TOKEN_MOCK,
  expiry_date: Date.now() + 3600 * 1000, // 1 hour
  id_token: ID_TOKEN_MOCK,
}

export const AUTH_COOKIE_MOCK = 'auth_cookie_mock'

export const googleUserResponseMock: UserInfoResponse = {
  sub: '1234567890',
  name: 'jeffery ji',
  given_name: 'jeffery',
  family_name: 'ji',
  picture: 'https://example.com/picture.jpg',
  email: 'jeffery@gmail.com',
  email_verified: true,
  hd: 'gmail.com',
}

export const authMock: Authentication = {
  id: '67ff38a56a35e1b6cf43a681',
  email: 'jeffery@gmail.com',
  type: 'OAuth',
  provider: 'google',
  providerAccountId: '1234567890',
  refreshToken: 'refreshToken',
  accessToken: ACCESS_TOKEN_MOCK,
  expiresAt: Date.now(),
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const authCreateMock: CreateAuthenticationData = {
  email: 'jeffery@gmail.com',
  type: 'OAuth',
  provider: 'google',
  providerAccountId: 'account_id',
  refreshToken: 'refreshToken',
  accessToken: ACCESS_TOKEN_MOCK,
  expiresAt: Date.now(),
}

/*
 * Create auth user mock
 */
export const ADMIN_JWT_MOCK = "admin_JWT_token"
export const CLIENT_JWT_MOCK = "client_JWT_token"
export const STUDENT_JWT_MOCK = "student_JWT_token"

export const ADMIN_USER_UID = '000000000000000000000001'
export const CLIENT_USER_UID = '000000000000000000000002'
export const STUDENT_USER_UID = '000000000000000000000003'

export const adminMock: User = {
  id: ADMIN_USER_UID,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: UserRole.Admin,
  firstName: 'Admin',
  lastName: '1',
  email: 'admin123@gmail.com',
  password: 'abcdefg',
}

export const clientMock: User = {
  id: CLIENT_USER_UID,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: UserRole.Client,
  firstName: 'Client',
  lastName: '1',
  email: 'client123@gmail.com',
  password: 'abcdefg',
}

export const studentMock: User = {
  id: STUDENT_USER_UID,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: UserRole.Client,
  firstName: 'Student',
  lastName: '1',
  email: 'student123@gmail.com',
  password: 'abcdefg',
}
