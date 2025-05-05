import { validatePassword } from '@/utils/validatePassword'

describe('tests /utils/validateEmail', async () => {
  it('valid password', () => {
    const validPassword = 'Password123!'
    const result = validatePassword(validPassword)
    expect(result.isValid).toBe(true)
  })

  it('invalid password', () => {
    const invalidPassword = 'password'
    const result = validatePassword(invalidPassword)
    expect(result.isValid).toBe(false)

    const invalidPassword1 = 'PASSWORD'
    const result1 = validatePassword(invalidPassword1)
    expect(result1.isValid).toBe(false)

    const invalidPassword2 = '12345678'
    const result2 = validatePassword(invalidPassword2)
    expect(result2.isValid).toBe(false)

    const invalidPassword3 = 'Password123'
    const result3 = validatePassword(invalidPassword3)
    expect(result3.isValid).toBe(false)
  })
})
