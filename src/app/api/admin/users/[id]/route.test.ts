import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import { clientAdditionalInfoCreateMock, clientCreateMock } from '@/test-config/mocks/User.mock'
import { GET } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('admin fetch user', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  // currently the only ID that works
  // 67fdc27019dd81b68db9bb64
  it('fetch user by Id', async () => {
    const userService = new UserService()
    const newClient = await userService.createUser(clientCreateMock)
    const newClientInfo = await userService.createClientAdditionalInfo({
      ...clientAdditionalInfoCreateMock,
      client: newClient,
    })
    const id = typeof newClientInfo.client === 'object' ? newClientInfo.client.id : newClientInfo.client
    const slug = { id }
    const res = await GET({} as NextRequest, {
      params: paramsToPromise(slug),
    })

    const json = await res.json()
    expect(res.status).toBe(StatusCodes.OK)
    expect(await json.data.length).toEqual(1)
    expect(await json).toEqual(newClientInfo)
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
