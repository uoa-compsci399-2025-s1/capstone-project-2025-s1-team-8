import { checkRole } from './access'
import { User } from '@/payload-types'
import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { UserRole } from '@/types/User'
import { adminCreateMock, clientCreateMock, studentCreateMock } from '@/test-config/mocks/User.mock'

describe('Check Role', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  test('Check for Admin access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: adminCreateMock,
    })
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(true)
    expect(checkRole([UserRole.Client, UserRole.Student], user1)).toBe(false)
  })

  test('Check for Client access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: clientCreateMock,
    })
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(true)
    expect(checkRole([UserRole.Admin, UserRole.Student], user1)).toBe(false)
  })

  test('Check for Student access', async () => {
    const user1: User = await testPayloadObject.create({
      collection: 'user',
      data: studentCreateMock,
    })
    expect(checkRole([UserRole.Admin, UserRole.Client], user1)).toBe(false)
    expect(checkRole([UserRole.Client, UserRole.Student], user1)).toBe(true)
    expect(checkRole([UserRole.Admin, UserRole.Student], user1)).toBe(true)
  })
})
