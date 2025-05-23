import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { createMockNextRequest } from '@/test-config/utils'
import { GET } from './route'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
  studentCreateMock,
} from '@/test-config/mocks/User.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { adminMock, clientMock, studentMock } from '@/test-config/mocks/Auth.mock'

describe('tests /api/admin/users', async () => {
  const userService = new UserService()
  const cookieStore = await cookies()

  describe('GET /api/admin/users', () => {
    it('should return a 401 if no token is provided', async () => {
      const req = createMockNextRequest(`/api/admin/users`)
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const req = createMockNextRequest(`/api/admin/users`)
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const req2 = createMockNextRequest(`/api/admin/users`)
      const res2 = await GET(req2)
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should get all users correctly', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser1 = await userService.createUser(clientCreateMock)
      const newUser2 = await userService.createUser(adminCreateMock)
      const req = createMockNextRequest(`/api/admin/users`)
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(expect.arrayContaining([newUser1, newUser2]))
    })

    it('should return a 400 if the limit is invalid', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const invalidLimitReq = createMockNextRequest(`/api/admin/users?limit=-1`)
      const res = await GET(invalidLimitReq)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should get all users correctly with limits', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await userService.createUser(clientCreateMock)
      await userService.createUser(adminCreateMock)
      const req = createMockNextRequest(`/api/admin/users?limit=1`)
      const res = await GET(req)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toEqual(1)
      expect(json.nextPage).toBeDefined()
    })

    it('should get all users correctly with limits and cursor', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest(`/api/admin/users?limit=3&cursor=1`)
      const res = await GET(req)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toEqual(3)
      expect(json.nextPage).toBeNull()
    })

    it('should filter users based on role params', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const clientReq = createMockNextRequest('/api/admin/users?role=client')
      const res = await GET(clientReq)
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([clientMock])

      const studentReq = createMockNextRequest('/api/admin/users?role=student')
      const res2 = await GET(studentReq)
      expect((await res2.json()).data).toEqual([studentMock])

      const adminReq = createMockNextRequest('/api/admin/users?role=admin')
      const res3 = await GET(adminReq)
      expect((await res3.json()).data).toEqual([adminMock])
    })

    it('should still paginate correctly with role param filters', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await userService.createUser(clientCreateMock)
      await userService.createUser({ ...clientCreateMock, email: 'pog@gmail.com' })
      await userService.createUser(studentCreateMock)

      const req = createMockNextRequest('/api/admin/users?role=client&limit=1')
      const res = await GET(req)
      const json = await res.json()
      expect(json.data.length).toBe(1)
      expect(json.nextPage).toBe(2)

      const req2 = createMockNextRequest(
        `/api/admin/users?role=client&limit=1&cursor=${json.nextPage}`,
      )
      const res2 = await GET(req2)
      const json2 = await res2.json()
      expect(json2.data.length).toBe(1)
      expect(json2.nextPage).toBe(3)
    })

    it('should return client additional info as well', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newClient = await userService.createUser(clientCreateMock)
      const newClientInfo = await userService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: newClient,
      })
      const req = createMockNextRequest(`/api/admin/users`)
      const res = await GET(req)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toEqual(4) // includes the 3 mocked users in the database
      expect(json.data[0]).toStrictEqual({
        ...newClient,
        introduction: newClientInfo.introduction,
        affiliation: newClientInfo.affiliation,
      })
    })

    it('should return a valid response if the cursor is invalid or out of range', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const invalidCursorReq = createMockNextRequest(`/api/admin/users?cursor=invalid`)
      const res = await GET(invalidCursorReq)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toBe(3)
      expect(json.nextPage).toBeNull()

      const outOfRangeReq = createMockNextRequest(`/api/admin/users?cursor=100`)
      const res2 = await GET(outOfRangeReq)
      const json2 = await res2.json()
      expect(json2.data).toEqual([])
      expect(json2.nextPage).toBeNull()
    })
  })
})
