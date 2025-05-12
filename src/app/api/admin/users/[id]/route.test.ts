import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

import { createMockNextPatchRequest, paramsToPromise } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  studentCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'
import { GET, PATCH, DELETE } from '@/app/api/admin/users/[id]/route'
import { UserCombinedInfo } from '@/types/Collections'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('test /api/admin/users/[id]', async () => {
  const userService = new UserService()
  const cookieStore = await cookies()

  describe('test GET /api/admin/users/[id]', () => {
    it('should return a 401 if no auth cookie', async () => {
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'test' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'test' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('fetch client by Id', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id =
        typeof clientAdditionalInfoMock.client === 'object'
          ? clientAdditionalInfoMock.client.id
          : clientAdditionalInfoMock.client

      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id }),
      })

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...clientMock,
        introduction: clientAdditionalInfoMock.introduction,
        affiliation: clientAdditionalInfoMock.affiliation,
      })
    })

    it('fetch generic user by Id', async () => {
      const newClient = await userService.createUser(adminCreateMock)
      const newClientInfo = await userService.createClientAdditionalInfo({
        ...adminCreateMock,
        client: newClient,
      })

      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: newClient.id }),
      })

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...newClient,
        introduction: newClientInfo.introduction,
        affiliation: newClientInfo.affiliation,
      })
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })

  describe('tests PATCH /api/admin/users/[id]', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: '1' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'eee' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'eee' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it("update client user's firstName by Id", async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id =
        typeof clientAdditionalInfoMock.client === 'object'
          ? clientAdditionalInfoMock.client.id
          : clientAdditionalInfoMock.client
      const payload = { firstName: 'Sheena Lin' }
      const mockedReq = createMockNextPatchRequest('api/admin/users/' + id, payload)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheena Lin'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: clientAdditionalInfoCreateMock.introduction,
        affiliation: clientAdditionalInfoCreateMock.affiliation,
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update client user by Id with existing introduction and affiliation', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id =
        typeof clientAdditionalInfoMock.client === 'object'
          ? clientAdditionalInfoMock.client.id
          : clientAdditionalInfoMock.client
      const payload = {
        firstName: 'Sheena Lin',
        introduction: 'new intro',
        affiliation: 'new affiliation',
      }
      const mockedReq = createMockNextPatchRequest('api/admin/users/' + id, payload)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheena Lin'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: 'new intro',
        affiliation: 'new affiliation',
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update client user by Id with no AdditionalClientInfo', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const id = clientMock.id
      const payload = { firstName: 'Sheenaaaaaa' }
      const mockedReq = createMockNextPatchRequest('api/admin/users/' + id, payload)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheenaaaaaa'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update name, intro, affiliation of client user by Id with no AdditionalClientInfo', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const id = clientMock.id
      const payload = {
        firstName: 'Sheenaaaaaa',
        introduction: 'introooo',
        affiliation: 'afil',
      }
      const mockedReq = createMockNextPatchRequest('api/admin/users/' + id, payload)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheenaaaaaa'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: 'introooo',
        affiliation: 'afil',
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update student user by Id', async () => {
      const userService = new UserService()
      const newStudent = await userService.createUser(studentCreateMock)
      const id = newStudent.id
      const payload = { firstName: 'Sheena' }
      const mockedReq = createMockNextPatchRequest('api/admin/users/' + id, payload)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...newStudent,
        firstName: 'Sheena',
        updatedAt: json.data.updatedAt,
      })
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })

  describe('tests DELETE /api/admin/users/[id]', () => {
    it('should return a 401 if the user is not authenticated', async () => {
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a client or student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should delete a user', async () => {
      const newUser = await userService.createUser(clientCreateMock)
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userService.getUser(newUser.id)).rejects.toThrow('Not Found')
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE({} as NextRequest, { params: paramsToPromise({ id: 'noid' }) })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
