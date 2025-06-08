import { describe } from 'vitest'
import { formatDate } from './date'

describe('Date Utils', () => {
  it('Should format date correctly', () => {
    const date = new Date('2023-10-01T00:00:00Z')
    const formattedDate = formatDate(date)
    expect(formattedDate).toBe('1/10/2023')
  })
})
