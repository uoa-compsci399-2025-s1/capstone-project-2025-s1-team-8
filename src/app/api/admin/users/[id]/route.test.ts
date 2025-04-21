import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import { clientAdditionalInfoCreateMock, clientCreateMock } from '@/test-config/mocks/User.mock'
import { GET, PATCH } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('admin fetch user tests', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('fetch user by Id', async () => {
    const userService = new UserService()
    const newClient = await userService.createUser(clientCreateMock)
    const newClientInfo = await userService.createClientAdditionalInfo({
      ...clientAdditionalInfoCreateMock,
      client: newClient,
    })
    const id =
      typeof newClientInfo.client === 'object' ? newClientInfo.client.id : newClientInfo.client
    const slug = { id }
    const res = await GET({} as NextRequest, {
      params: paramsToPromise(slug),
    })

    const json = await res.json()
    expect(res.status).toBe(StatusCodes.OK)
    expect(json).toEqual({
      ...newClient,
      introduction: newClientInfo.introduction,
      affiliation: newClientInfo.affiliation,
    })
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

describe('admin update user tests', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('update user by Id', async () => {
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

    // i couldnt figure out how to put a body in the request except to do this
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
      // jeffery can i hardcode this?
      firstName: 'Sheena Lin',
      introduction: newClientInfo.introduction,
      affiliation: newClientInfo.affiliation,
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
