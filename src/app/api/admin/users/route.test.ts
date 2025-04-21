import { StatusCodes } from 'http-status-codes'

import { clearCollection, createMockNextRequest, testPayloadObject } from '@/test-config/utils'
import { GET } from './route'
import UserService from '@/data-layer/services/UserService'
import {
  adminCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'

describe('tests GET /api/admin/users', () => {
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

  it('should return a 400 if the limit is invalid', async () => {
    const invalidLimitReq = createMockNextRequest(`/api/admin/users?limit=-1`)
    const res = await GET(invalidLimitReq)
    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
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

  it('should return client additional info as well', async () => {
    const newClient = await userService.createUser(clientCreateMock)
    const newClientInfo = await userService.createClientAdditionalInfo({
      ...clientAdditionalInfoCreateMock,
      client: newClient,
    })
    const req = createMockNextRequest(`/api/admin/users`)
    const res = await GET(req)
    const json = await res.json()
    console.log(json.data)
    expect(res.status).toBe(StatusCodes.OK)
    expect(json.data.length).toEqual(1)
    expect(json.data[0]).toStrictEqual({
      ...newClient,
      introduction: newClientInfo.introduction,
      affiliation: newClientInfo.affiliation,
    })
  })

  it('should return a valid response if the cursor is invalid or out of range', async () => {
    const invalidCursorReq = createMockNextRequest(`/api/admin/users?cursor=invalid`)
    const res = await GET(invalidCursorReq)
    const json = await res.json()
    expect(res.status).toBe(StatusCodes.OK)
    expect(json.data).toEqual([])
    expect(json.nextCursor).toBeNull()

    const outOfRangeReq = createMockNextRequest(`/api/admin/users?cursor=100`)
    const res2 = await GET(outOfRangeReq)
    const json2 = await res2.json()
    expect(json2.data).toEqual([])
    expect(json2.nextCursor).toBeNull()
  })
})
