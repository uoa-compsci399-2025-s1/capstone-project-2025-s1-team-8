import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  studentCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'
import { GET, PATCH } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('test /api/admin/users/[id]', () => {
  const userService = new UserService()
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

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
      const slug = { id }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
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
      const slug = { id: 'nonexistent' }
      const res = await GET({} as NextRequest, {
        params: paramsToPromise(slug),
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
      const slug = { id }
      const body = '{ "firstName": "Sheena Lin" }'
      const request = new NextRequest('http://localhost:3000/api/admin/users/' + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      const res = await PATCH(request, {
        params: paramsToPromise(slug),
      })
      const json = await res.json()
      if (typeof clientAdditionalInfoMock.client === 'object') {
        clientAdditionalInfoMock.client.firstName = 'Sheena Lin'
        clientAdditionalInfoMock.client.updatedAt = json.client.updatedAt
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual({
        ...clientAdditionalInfoMock,
        introduction: clientAdditionalInfoMock.introduction,
        affiliation: clientAdditionalInfoMock.affiliation,
        updatedAt: json.updatedAt,
      })
    })

    it('update client user by Id with new introduction and affiliation', async () => {
      const clientMock = await userService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id =
        typeof clientAdditionalInfoMock.client === 'object'
          ? clientAdditionalInfoMock.client.id
          : clientAdditionalInfoMock.client
      const slug = { id }
      const body =
        '{ "firstName": "Sheena Lin", "introduction": "new intro", "affiliation": "new affiliation"}'
      const request = new NextRequest('http://localhost:3000/api/admin/users/' + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      const res = await PATCH(request, {
        params: paramsToPromise(slug),
      })
      const json = await res.json()
      if (typeof clientAdditionalInfoMock.client === 'object') {
        clientAdditionalInfoMock.client.firstName = 'Sheena Lin'
        clientAdditionalInfoMock.client.updatedAt = json.client.updatedAt
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json).toEqual({
        ...clientAdditionalInfoMock,
        introduction: 'new intro',
        affiliation: 'new affiliation',
        updatedAt: json.updatedAt,
      })
    })

    it('update student user by Id', async () => {
      const userService = new UserService()
      const newStudent = await userService.createUser(studentCreateMock)
      const id = newStudent.id
      const slug = { id }
      const body = '{ "firstName": "Sheena" }'
      const request = new NextRequest('http://localhost:3000/api/admin/users/' + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      const res = await PATCH(request, {
        params: paramsToPromise(slug),
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
      const slug = { id: 'nonexistent' }
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })
})
