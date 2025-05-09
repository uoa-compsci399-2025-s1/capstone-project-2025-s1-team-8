import { isValidEmail } from './util'

describe('lib/utils', () => {
  describe('isValidEmail', () => {
    it('should catch correct emails', () => {
      expect(isValidEmail('jeffery@gmail.com')).toBeTruthy()
      expect(isValidEmail('je.ffery@x.com')).toBeTruthy()
      expect(isValidEmail('jeffe.ry@gmail.submail.com')).toBeTruthy()
      expect(isValidEmail('j@m.com')).toBeTruthy()
    })

    it('should catch incorrect emails', () => {
      expect(isValidEmail('je.ffery@x..com')).toBeFalsy()
      expect(isValidEmail('@1.com')).toBeFalsy()
      expect(isValidEmail('1@.com')).toBeFalsy()
      expect(isValidEmail('1@.')).toBeFalsy()
      expect(isValidEmail('1@x.')).toBeFalsy()
      expect(isValidEmail('@x.com')).toBeFalsy()
      expect(isValidEmail('@x')).toBeFalsy()
      expect(isValidEmail('@')).toBeFalsy()
      expect(isValidEmail('obviouslyfakeemail')).toBeFalsy()
      expect(isValidEmail('a@hash#.com')).toBeFalsy()
      expect(isValidEmail('a@a*search.com')).toBeFalsy()
    })
  })
})
