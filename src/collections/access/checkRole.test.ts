import { expect, test, describe, afterEach } from 'vitest'
import { checkRole } from './checkRole'
import { User } from '@/payload-types'
import { Role } from '@/types/RoleTypes'
import { clearCollection, testPayloadObject } from 'tests/utils'
import { password } from 'payload/shared'

describe('Check Role', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })
  test('Check for Admin access', async () => {
    const userData= {
      role: Role.Admin,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password:'abcdefg'
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })
    expect(checkRole([Role.Admin], user1)).toBe(true)
    expect(checkRole([Role.Client], user1)).toBe(false)
    expect(checkRole([Role.Admin, Role.Client], user1)).toBe(true)
    expect(checkRole([Role.Client, Role.Student], user1)).toBe(false)
  })
  
  test('Check for Client access', async () => {
    const userData= {
      role: Role.Client,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password:'abcdefg'
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })
    expect(checkRole([Role.Client], user1)).toBe(true)
    expect(checkRole([Role.Admin], user1)).toBe(false)
    expect(checkRole([Role.Admin, Role.Client], user1)).toBe(true)
    expect(checkRole([Role.Client, Role.Student], user1)).toBe(true)
  })
  
  test('Check for Student access', async () => {
    const userData= {
      role: Role.Student,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password:'abcdefg'
    }

    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: userData,
    })
    expect(checkRole([Role.Student], user1)).toBe(true)
    expect(checkRole([Role.Client], user1)).toBe(false)
    expect(checkRole([Role.Admin, Role.Client], user1)).toBe(false)
    expect(checkRole([Role.Client, Role.Student], user1)).toBe(true)
    expect(checkRole([Role.Admin, Role.Student], user1)).toBe(true)
  })
  
})