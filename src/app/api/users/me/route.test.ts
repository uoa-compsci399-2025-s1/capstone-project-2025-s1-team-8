import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { GET, PATCH } from './route'
import {
  createMockNextPatchRequest,
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { adminMock, clientMock, studentMock } from '@/test-config/mocks/Auth.mock'
import { clientAdditionalInfoCreateMock } from '@/test-config/mocks/User.mock'
import { UserCombinedInfo } from '@/types/Collections'
import UserService from '@/data-layer/services/UserService'

describe('tests /api/users/me', async () => {
  const cookieStore = await cookies()
  const userService = new UserService()

  describe('GET /api/users/me', () => {
    it('should return a 401 if no user is authenticated', async () => {
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('should return student user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(studentMock)
    })

    it('should return client user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(clientMock)
    })

    it('should return admin user data', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('/api/users/me'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual(adminMock)
    })
  })

  // describe('tests PATCH /api/users/me', () => {
  //   it('401 error if the user is not authenticated', async () => {
  //     const res = await PATCH(createMockNextRequest('/api/users/me'))
  //
  //     expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
  //     expect((await res.json()).error).toBe('No token provided')
  //   })
  //
  //   it("update client user's firstName", async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, clientToken)
  //
  //     const createdClientMock = await userService.createUser(clientMock)
  //     await userService.createClientAdditionalInfo({
  //       ...clientAdditionalInfoCreateMock,
  //       client: createdClientMock,
  //     })
  //     const changedName = 'CHANGED Sheena Lin'
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       firstName: changedName,
  //     })
  //     const res = await PATCH(mockedReq)
  //     const json = await res.json()
  //     const combinedClientInfo: UserCombinedInfo = {
  //       ...clientMock,
  //       firstName: changedName,
  //       introduction: clientAdditionalInfoCreateMock.introduction,
  //       affiliation: clientAdditionalInfoCreateMock.affiliation,
  //       updatedAt: json.data.updatedAt,
  //       id: createdClientMock.id,
  //     }
  //
  //     expect(res.status).toBe(StatusCodes.OK)
  //     expect(json.data).toEqual(combinedClientInfo)
  //   })
  //
  //   it('update name, intro, affiliation of client user with no AdditionalClientInfo', async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, clientToken)
  //
  //     const createdClientMock = await userService.createUser(clientMock)
  //     await userService.createClientAdditionalInfo({
  //       ...clientAdditionalInfoCreateMock,
  //       client: createdClientMock,
  //     })
  //     const changedName = 'CHANGED Sheena Lin'
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       firstName: changedName,
  //       introduction: 'introooo',
  //       affiliation: 'afil',
  //     })
  //     const res = await PATCH(mockedReq, {
  //       params: paramsToPromise({ id: createdClientMock.id }),
  //     })
  //     const json = await res.json()
  //     const combinedClientInfo: UserCombinedInfo = {
  //       ...clientMock,
  //       firstName: changedName,
  //       introduction: 'introooo',
  //       affiliation: 'afil',
  //       updatedAt: json.data.updatedAt,
  //       id: createdClientMock.id,
  //     }
  //
  //     expect(res.status).toBe(StatusCodes.OK)
  //     expect(json.data).toEqual(combinedClientInfo)
  //   })
  //
  //   it('update student user', async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, studentToken)
  //
  //     const createdStudentMock = await userService.createUser(studentMock)
  //     const changedName = 'CHANGED Sheena Lin'
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       firstName: changedName,
  //     })
  //     const res = await PATCH(mockedReq, {
  //       params: paramsToPromise({ id: createdStudentMock.id }),
  //     })
  //     const json = await res.json()
  //     const combinedUserInfo: UserCombinedInfo = {
  //       ...studentMock,
  //       firstName: changedName,
  //       updatedAt: json.data.updatedAt,
  //       id: createdStudentMock.id,
  //     }
  //
  //     expect(res.status).toBe(StatusCodes.OK)
  //     expect(json.data).toEqual(combinedUserInfo)
  //   })
  //
  //   it('update admin user', async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, adminToken)
  //
  //     const createdAdminMock = await userService.createUser(adminMock)
  //     const id = createdAdminMock.id
  //     const changedName = 'CHANGED Sheena Lin'
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       firstName: changedName,
  //     })
  //     const res = await PATCH(mockedReq, {
  //       params: paramsToPromise({ id }),
  //     })
  //     const json = await res.json()
  //     const combinedUserInfo: UserCombinedInfo = {
  //       ...adminMock,
  //       firstName: changedName,
  //       updatedAt: json.data.updatedAt,
  //       id: createdAdminMock.id,
  //     }
  //
  //     expect(res.status).toBe(StatusCodes.OK)
  //     expect(json.data).toEqual(combinedUserInfo)
  //   })
  //
  //   it('Bad request when changing email', async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, studentToken)
  //
  //     const createdStudentMock = await userService.createUser(studentMock)
  //     const id = createdStudentMock.id
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       email: 'new@gmail.com',
  //     })
  //     const res = await PATCH(mockedReq, {
  //       params: paramsToPromise({ id }),
  //     })
  //
  //     const json = await res.json()
  //     expect(res.status).toBe(StatusCodes.BAD_REQUEST)
  //     expect(json.error).toBe('Invalid request body')
  //   })
  //
  //   it('Bad request when changing role', async () => {
  //     cookieStore.set(AUTH_COOKIE_NAME, studentToken)
  //
  //     const createdStudentMock = await userService.createUser(studentMock)
  //
  //     const mockedReq = createMockNextPatchRequest('http://localhost:3000/api/users/me/', {
  //       role: 'admin',
  //     })
  //     const res = await PATCH(mockedReq, {
  //       params: paramsToPromise({ id: createdStudentMock.id }),
  //     })
  //     const json = await res.json()
  //     expect(res.status).toBe(StatusCodes.BAD_REQUEST)
  //     expect(json.error).toBe('Invalid request body')
  //   })
  // })
})
