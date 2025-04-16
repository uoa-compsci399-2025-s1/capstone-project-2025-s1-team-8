import { describe, it, expect, afterEach } from 'vitest'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { UserService } from './UserService'
import { adminCreateMock } from '@/test-config/mocks/User.mock'
import { clientCreateMock } from '@/test-config/mocks/User.mock'
import { studentCreateMock } from '@/test-config/mocks/User.mock'

describe('User service test', () => {
  const userService = new UserService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('should create a new admin user', async () => {
    const newUser = await userService.createUser(adminCreateMock)
    const fetchedUser = await testPayloadObject.findByID({
      collection: 'user',
      id: newUser.id,
    })
    expect(newUser).toEqual(fetchedUser)
  })

  it('should create a new client user', async () => {
    const newUser = await userService.createUser(clientCreateMock)
    const fetchedUser = await testPayloadObject.findByID({
      collection: 'user',
      id: newUser.id,
    })
    expect(newUser).toEqual(fetchedUser)
  })

  it('should create a new student user', async () => {
    const newUser = await userService.createUser(studentCreateMock)
    const fetchedUser = await testPayloadObject.findByID({
      collection: 'user',
      id: newUser.id,
    })
    expect(newUser).toEqual(fetchedUser)
  })
})
