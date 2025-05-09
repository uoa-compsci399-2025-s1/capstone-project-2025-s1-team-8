import { validatePassword, validateEmail } from '@/utils/authUtils'

describe('test /utils/authUtils', async () => {
  describe('tests /utils/authUtils#validateEmail', async () => {
    it('valid email', () => {
      const validEmail = 'abc@example.com'
      const result = validateEmail(validEmail)
      expect(result).toBe(true)

      const invalidEmail1 = 'a-bc@example.com'
      const result1 = validateEmail(invalidEmail1)
      expect(result1).toBe(true)
    })

    it('invalid email', () => {
      const invalidEmail1 = 'abcexample.com'
      const result1 = validateEmail(invalidEmail1)
      expect(result1).toBe(false)

      const invalidEmail2 = 'abc@examplecom'
      const result2 = validateEmail(invalidEmail2)
      expect(result2).toBe(false)

      const invalidEmail3 = 'a/bc@example.com'
      const result3 = validateEmail(invalidEmail3)
      expect(result3).toBe(false)

      const invalidEmail4 = '@example.com'
      const result4 = validateEmail(invalidEmail4)
      expect(result4).toBe(false)
    })
  })

  describe('tests /utils/authUtils#validatePassword', async () => {
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
})
