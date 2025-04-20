import { StatusCodes } from 'http-status-codes'

import { clearCollection, createMockNextRequest, testPayloadObject } from '@/test-config/utils'
import { GET } from './route'
import UserService from '@/data-layer/services/UserService'
import { adminCreateMock, clientCreateMock } from '@/test-config/mocks/User.mock'

describe('get user count', () => {
  const userService = new UserService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('should get all users correctly', async () => {
    const newUser1 = await userService.createUser(clientCreateMock)
    const newUser2 = await userService.createUser(adminCreateMock)
    const req = createMockNextRequest(`/api/admin/users`)
    const res = await GET(req)
    expect(res.status).toBe(StatusCodes.OK)
    expect((await res.json()).data).toEqual(expect.arrayContaining([newUser1, newUser2]))
  })

  it('should get all users correctly with limits', async () => {
    await userService.createUser(clientCreateMock)
    await userService.createUser(adminCreateMock)
    const req = createMockNextRequest(`/api/admin/users?limit=1`)
    const res = await GET(req)
    const json = await res.json()
    expect(res.status).toBe(StatusCodes.OK)
    expect(json.data.length).toEqual(1)
    expect(json.nextCursor).toBeDefined()
  })

  it('should get all users correctly with limits and cursor', async () => {
    await userService.createUser(clientCreateMock)
    await userService.createUser(adminCreateMock)
    const req = createMockNextRequest(`/api/admin/users?limit=1&cursor=2`)
    const res = await GET(req)
    const json = await res.json()
    expect(res.status).toBe(StatusCodes.OK)
    expect(json.data.length).toEqual(1)
    expect(json.nextCursor).toBeNull()
  })
})
