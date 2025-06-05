import { GET } from './route'

describe('globals/client', () => {
  describe('GET', () => {
    it('should return the global client document', async () => {
      const response = await GET()

      const json = await response.json()

      expect(json).toEqual({
        data: {
          tipContent:
            '• Keep it short and straight to the point!\n\n• Please use the description if you would like to say more!',
          tipTitle: 'Tips for choosing a good project name:',
        },
      })
    })
  })
})
