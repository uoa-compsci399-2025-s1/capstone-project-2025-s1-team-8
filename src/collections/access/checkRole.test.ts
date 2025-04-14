import { expect, test } from 'vitest'
import { checkRole } from './checkRole'
import { User } from '@/payload-types'
import { Role } from '@/types/RoleTypes'

test('Check for Admin access', () => {
  const user1: User = {
    id: '1',
    role: Role.Admin,
    firstName: 'John',
    lastName: 'Doe',
    updatedAt: 'now',
    createdAt: 'now',
    email: 'johndoe@gmail.com',
  }
  expect(checkRole([Role.Admin], user1)).toBe(true)
  expect(checkRole([Role.Client], user1)).toBe(false)
  expect(checkRole([Role.Admin, Role.Client], user1)).toBe(true)
  expect(checkRole([Role.Client, Role.Student], user1)).toBe(false)
})

test('Check for Client access', () => {
  const user1: User = {
    id: '1',
    role: Role.Client,
    firstName: 'John',
    lastName: 'Doe',
    updatedAt: 'now',
    createdAt: 'now',
    email: 'johndoe@gmail.com',
  }
  expect(checkRole([Role.Client], user1)).toBe(true)
  expect(checkRole([Role.Admin], user1)).toBe(false)
  expect(checkRole([Role.Admin, Role.Client], user1)).toBe(true)
  expect(checkRole([Role.Client, Role.Student], user1)).toBe(true)
})

test('Check for Student access', () => {
  const user1: User = {
    id: '1',
    role: Role.Student,
    firstName: 'John',
    lastName: 'Doe',
    updatedAt: 'now',
    createdAt: 'now',
    email: 'johndoe@gmail.com',
  }
  expect(checkRole([Role.Student], user1)).toBe(true)
  expect(checkRole([Role.Client], user1)).toBe(false)
  expect(checkRole([Role.Admin, Role.Client], user1)).toBe(false)
  expect(checkRole([Role.Client, Role.Student], user1)).toBe(true)
  expect(checkRole([Role.Admin, Role.Student], user1)).toBe(true)
})
