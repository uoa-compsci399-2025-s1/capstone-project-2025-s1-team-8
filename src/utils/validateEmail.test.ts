import { isValidEmail } from '@/utils/isValidEmail'

describe('tests /utils/isValidEmail', async () => {
  it('valid email', () => {
    const validEmail = 'abc@example.com'
    const result = isValidEmail(validEmail)
    expect(result).toBe(true)

    const invalidEmail1 = 'a-bc@example.com'
    const result1 = isValidEmail(invalidEmail1)
    expect(result1).toBe(true)
  })

  it('invalid email', () => {
    const invalidEmail1 = 'abcexample.com'
    const result1 = isValidEmail(invalidEmail1)
    expect(result1).toBe(false)

    const invalidEmail2 = 'abc@examplecom'
    const result2 = isValidEmail(invalidEmail2)
    expect(result2).toBe(false)

    const invalidEmail3 = 'a/bc@example.com'
    const result3 = isValidEmail(invalidEmail3)
    expect(result3).toBe(false)

    const invalidEmail4 = '@example.com'
    const result4 = isValidEmail(invalidEmail4)
    expect(result4).toBe(false)
  })
})