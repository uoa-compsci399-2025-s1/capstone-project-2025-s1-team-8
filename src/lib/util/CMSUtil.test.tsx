import { parseCMS } from './CMSUtil'
import { render, screen } from '@testing-library/react'

describe('lib/util/CMSUtil', () => {
  describe('parseCMS', () => {
    it('should parse a string into an array of lines', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const result = parseCMS(text)

      render(<div data-testid="section">{result}</div>)
      const section = screen.getByTestId('section')

      expect(section).toBeInTheDocument()
      expect(section).toHaveTextContent('Line 1')
      expect(section).toHaveTextContent('Line 2')
      expect(section).toHaveTextContent('Line 3')

      const brElements = section.querySelectorAll('br')
      expect(brElements.length).toBe(3)
    })
  })
})
