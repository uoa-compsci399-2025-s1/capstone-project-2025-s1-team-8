import { expect, test, describe, afterEach } from 'vitest'
import { checkRole } from './access'
import { User } from '@/payload-types'
import { clearCollection, testPayloadObject } from 'tests/utils'
import { UserRole } from '@/types/user'
import { userCreateMock } from 'tests/mocks/User.mock'

describe('Check Role', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  test('Check for Admin access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userCreateMock,
    })
    expect(checkRole([UserRole.Admin], user1)).toBe(true)
    expect(checkRole([UserRole.Client], user1)).toBe(false)
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(true)
    expect(checkRole([UserRole.Client, UserRole.Student], user1)).toBe(false)
  })

  test('Check for Client access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userCreateMock,
    })
    expect(checkRole([UserRole.Client], user1)).toBe(true)
    expect(checkRole([UserRole.Admin], user1)).toBe(false)
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(true)
    expect(checkRole([UserRole.Client, UserRole.Student], user1)).toBe(true)
  })

  test('Check for Student access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userCreateMock,
    })
    expect(checkRole([UserRole.Student], user1)).toBe(true)
    expect(checkRole([UserRole.Client], user1)).toBe(false)
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(false)
    expect(checkRole([UserRole.Client, UserRole.Student], user1)).toBe(true)
    expect(checkRole([UserRole.Admin, UserRole.Student], user1)).toBe(true)
  })
})
