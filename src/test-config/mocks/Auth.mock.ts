import { Authentication } from '@/payload-types'
import { CreateAuthenticationData } from '@/types/Collections'

export const STATE_MOCK = 'coolstate'
export const SCOPE_MOCK = ['scope1', 'scope2']
export const REDIRECT_URI_MOCK = `https://accounts.google.com/o/oauth2/v2/auth?state=${STATE_MOCK}&scope=${SCOPE_MOCK}`

export const authMock: Authentication = {
  id: '67ff38a56a35e1b6cf43a681',
  user: '67ff38a56a35e1b6cf43a681',
  type: 'OAuth',
  provider: 'google',
  providerAccountId: '1234567890',
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  expiresAt: Date.now(),
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const authCreateMock: CreateAuthenticationData = {
  user: '67ff38a56a35e1b6cf43a681',
  type: 'OAuth',
  provider: 'google',
  providerAccountId: '1234567890',
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  expiresAt: Date.now(),
}
