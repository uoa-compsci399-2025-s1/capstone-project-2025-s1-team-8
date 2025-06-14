import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { createMockNextRequest } from '@/test-config/utils'
import { GET } from './route'
import UserDataService from '@/data-layer/services/UserDataService'
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
  const userDataService = new UserDataService()
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
      const newUser1 = await userDataService.createUser(clientCreateMock)
      const newUser2 = await userDataService.createUser(adminCreateMock)
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
      await userDataService.createUser(clientCreateMock)
      await userDataService.createUser(adminCreateMock)
      const req = createMockNextRequest(`/api/admin/users?limit=1`)
      const res = await GET(req)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toEqual(1)
      expect(json.nextPage).toBeDefined()
    })

    it('should get all users correctly with limits and page', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest(`/api/admin/users?limit=3&page=1`)
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
      await userDataService.createUser(clientCreateMock)
      await userDataService.createUser({ ...clientCreateMock, email: 'pog@gmail.com' })
      await userDataService.createUser(studentCreateMock)

      const req = createMockNextRequest('/api/admin/users?role=client&limit=1')
      const res = await GET(req)
      const json = await res.json()
      expect(json.data.length).toBe(1)
      expect(json.nextPage).toBe(2)

      const req2 = createMockNextRequest(
        `/api/admin/users?role=client&limit=1&page=${json.nextPage}`,
      )
      const res2 = await GET(req2)
      const json2 = await res2.json()
      expect(json2.data.length).toBe(1)
      expect(json2.nextPage).toBe(3)
    })

    it('should correctly filter based on name queries', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const userMock = await userDataService.createUser({
        ...clientCreateMock,
        firstName: 'very',
        lastName: 'cool',
      })
      const userMock2 = await userDataService.createUser({
        ...clientCreateMock,
        lastName: 'col',
      })
      await userDataService.createUser({
        ...clientCreateMock,
        firstName: 'searchforme2',
        lastName: 'dontfindme',
      })

      const res = await GET(createMockNextRequest('/api/admin/users?query=cool'))
      const json = await res.json()

      expect(json.data.length).toBe(1)
      expect(json.data).toStrictEqual([userMock])

      const res2 = await GET(createMockNextRequest('/api/admin/users?query=very'))
      const json2 = await res2.json()

      expect(json2.data.length).toBe(1)
      expect(json2.data).toStrictEqual([userMock])

      const res3 = await GET(createMockNextRequest('/api/admin/users?query=co'))
      const json3 = await res3.json()
      expect(json3.data.length).toBe(2)
      expect(json3.data).toEqual(expect.arrayContaining([userMock, userMock2]))

      const res4 = await GET(createMockNextRequest('/api/admin/users?query=very+cool'))
      const json4 = await res4.json()
      expect(json4.data).toStrictEqual([userMock])
    })

    it('should return client additional info as well', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newClient = await userDataService.createUser(clientCreateMock)
      const newClientInfo = await userDataService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: newClient,
      })
      const req = createMockNextRequest(`/api/admin/users`)
      const res = await GET(req)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toEqual(4) // includes the 3 mocked users in the database
      expect(json.data).toEqual(
        expect.arrayContaining([
          {
            ...newClient,
            introduction: newClientInfo.introduction,
            affiliation: newClientInfo.affiliation,
          },
        ]),
      )
    })

    it('should return a valid response if the page is invalid or out of range', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const invalidPageReq = createMockNextRequest(`/api/admin/users?page=invalid`)
      const res = await GET(invalidPageReq)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.length).toBe(3)
      expect(json.nextPage).toBeNull()

      const outOfRangeReq = createMockNextRequest(`/api/admin/users?page=100`)
      const res2 = await GET(outOfRangeReq)
      const json2 = await res2.json()
      expect(json2.data).toEqual([])
      expect(json2.nextPage).toBeNull()
    })
  })
})
