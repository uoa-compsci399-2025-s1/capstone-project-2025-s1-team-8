import { isValidEmail, isValidPassword } from './util'

describe('lib/utils', () => {
  describe('isValidEmail', () => {
    it('should catch correct emails', () => {
      expect(isValidEmail('jeffery@gmail.com')).toBeTruthy()
      expect(isValidEmail('je.ffery@x.com')).toBeTruthy()
      expect(isValidEmail('jeffe.ry@gmail.submail.com')).toBeTruthy()
      expect(isValidEmail('j@m.com')).toBeTruthy()
      expect(isValidEmail('jefFerY@gmail.com')).toBeTruthy()
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

  describe('isValidPassword', () => {
    it('should validate correct passwords', () => {
      expect(isValidPassword('Password123!').isValid).toBeTruthy()
      expect(isValidPassword('Complex$99Password').isValid).toBeTruthy()
      expect(isValidPassword('Abcd1234!').isValid).toBeTruthy()
      expect(isValidPassword('P@ssw0rd').isValid).toBeTruthy()
      expect(isValidPassword('Super$tr0ngP@55').isValid).toBeTruthy()
    })

    it('should reject incorrect passwords', () => {
      // Missing uppercase
      expect(isValidPassword('password123!').isValid).toBeFalsy()
      // Missing lowercase
      expect(isValidPassword('PASSWORD123!').isValid).toBeFalsy()
      // Missing numbers
      expect(isValidPassword('Password!').isValid).toBeFalsy()
      // Missing special characters
      expect(isValidPassword('Password123').isValid).toBeFalsy()
      // Too short
      expect(isValidPassword('Pw1!').isValid).toBeFalsy()
    })
  })
})
