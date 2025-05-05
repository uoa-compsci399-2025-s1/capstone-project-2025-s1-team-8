import { validateEmail } from '@/utils/validateEmail'

describe('tests /utils/validateEmail', async () => {
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
