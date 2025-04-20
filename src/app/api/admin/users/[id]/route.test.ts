import { StatusCodes } from 'http-status-codes'

import { clearCollection, paramsToPromise, testPayloadObject } from '@/test-config/utils'
import UserService from '@/data-layer/services/UserService'
import { clientAdditionalInfoCreateMock } from '@/test-config/mocks/User.mock'
import { GET } from '@/app/api/admin/users/[id]/route'
import { NextRequest } from 'next/server'

describe('admin fetch user', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('fetch user by Id', async () => {
    const userService = new UserService()
    const user = await userService.createClientAdditionalInfo(clientAdditionalInfoCreateMock)
    const id = typeof user.client === 'object' ? user.client.id : user.client
    const slug = { id }
    const res = await GET({} as NextRequest, {
      params: paramsToPromise(slug),
    })
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual(user)
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
