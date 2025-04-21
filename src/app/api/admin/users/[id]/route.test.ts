import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import {
  clientAdditionalInfoCreateMock,
  clientCreateMock,
  studentCreateMock,
} from '@/test-config/mocks/User.mock'
import { PATCH } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('tests PATCH /api/admin/users/[id]', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('update client user by Id', async () => {
    const userService = new UserService()
    const newClient = await userService.createUser(clientCreateMock)
    const newClientInfo = await userService.createClientAdditionalInfo({
      ...clientAdditionalInfoCreateMock,
      client: newClient,
    })
    const id =
      typeof newClientInfo.client === 'object' ? newClientInfo.client.id : newClientInfo.client
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
    console.log(json)
    expect(res.status).toBe(StatusCodes.OK)
    expect(json).toEqual({
      ...newClient,
      firstName: 'Sheena Lin',
      introduction: newClientInfo.introduction,
      affiliation: newClientInfo.affiliation,
      updatedAt: json.updatedAt,
    })
  })

  it('update client user by Id with new introduction and affiliation', async () => {
    const userService = new UserService()
    const newClient = await userService.createUser(clientCreateMock)
    const newClientInfo = await userService.createClientAdditionalInfo({
      ...clientAdditionalInfoCreateMock,
      client: newClient,
    })
    const id =
      typeof newClientInfo.client === 'object' ? newClientInfo.client.id : newClientInfo.client
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
    console.log(json)
    expect(res.status).toBe(StatusCodes.OK)
    expect(json).toEqual({
      ...newClient,
      firstName: 'Sheena Lin',
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
    console.log(json)
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
