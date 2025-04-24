import { StatusCodes } from 'http-status-codes'

import {
  createMockNextPatchRequest,
  paramsToPromise,
} from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  studentCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'
import { GET, PATCH } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'
import { UserCombinedInfo } from '@/types/Collections'

describe('test /api/admin/users/[id]', () => {
  const userService = new UserService()

  describe('test GET /api/admin/users/[id]', () => {
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

      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id }),
      })

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual({
        ...clientMock,
        introduction: clientAdditionalInfoMock.introduction,
        affiliation: clientAdditionalInfoMock.affiliation,
      })
    })

    it('fetch generic user by Id', async () => {
      const newAdmin = await userService.createUser(adminCreateMock)
      const newAdminInfo = await userService.createClientAdditionalInfo({
        ...adminCreateMock,
        client: newAdmin,
      })
      expect(newAdminInfo.client).toEqual(newAdmin)
      expect(newAdminInfo.introduction === undefined).toBe(true)
      expect(newAdminInfo.affiliation === undefined).toBe(true)
    })

    it('should return a 404 error if the user does not exist', async () => {
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })

  describe('tests PATCH /api/admin/users/[id]', () => {
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
      const mockedReq = createMockNextPatchRequest(
        'http://localhost:3000/api/admin/users/' + id,
        payload,
      )
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheena Lin'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: clientAdditionalInfoCreateMock.introduction,
        affiliation: clientAdditionalInfoCreateMock.affiliation,
        updatedAt: json.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual(combinedClientInfo)
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
      const mockedReq = createMockNextPatchRequest(
        'http://localhost:3000/api/admin/users/' + id,
        payload,
      )
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheena Lin'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: 'new intro',
        affiliation: 'new affiliation',
        updatedAt: json.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual(combinedClientInfo)
    })

    it('update client user by Id with no AdditionalClientInfo', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const id = clientMock.id
      const payload = { firstName: 'Sheenaaaaaa' }
      const mockedReq = createMockNextPatchRequest(
        'http://localhost:3000/api/admin/users/' + id,
        payload,
      )
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheenaaaaaa'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        updatedAt: json.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual(combinedClientInfo)
    })

    it('update name, intro, affiliation of client user by Id with no AdditionalClientInfo', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const id = clientMock.id
      const payload = {
        firstName: 'Sheenaaaaaa',
        introduction: 'introooo',
        affiliation: 'afil',
      }
      const mockedReq = createMockNextPatchRequest(
        'http://localhost:3000/api/admin/users/' + id,
        payload,
      )
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      clientMock.firstName = 'Sheenaaaaaa'
      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        introduction: 'introooo',
        affiliation: 'afil',
        updatedAt: json.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual(combinedClientInfo)
    })

    it('update student user by Id', async () => {
      const userService = new UserService()
      const newStudent = await userService.createUser(studentCreateMock)
      const id = newStudent.id
      const payload = { firstName: 'Sheena' }
      const mockedReq = createMockNextPatchRequest(
        'http://localhost:3000/api/admin/users/' + id,
        payload,
      )
      const res = await PATCH(mockedReq, {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual({
        ...newStudent,
        firstName: 'Sheena',
        updatedAt: json.updatedAt,
      })
    })

    it('should return a 404 error if the user does not exist', async () => {
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })
})
