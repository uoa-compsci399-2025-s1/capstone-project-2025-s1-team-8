import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'
import { GET } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('admin fetch user', () => {
  const userService = new UserService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('fetch client by Id', async () => {
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
    console.log(json)
    expect(res.status).toBe(StatusCodes.OK)
    expect(json).toEqual({
      ...newClient,
      introduction: newClientInfo.introduction,
      affiliation: newClientInfo.affiliation,
    })
  })

  it('fetch generic user by Id', async () => {
    const newAdmin = await userService.createUser(adminCreateMock)
    const newAdminInfo = await userService.createClientAdditionalInfo({
      ...adminCreateMock,
      client: newAdmin,
    })
    console.log(newAdminInfo)
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
