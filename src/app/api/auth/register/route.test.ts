import { StatusCodes } from 'http-status-codes'

import { POST, RegisterRequestBody } from './route'
import { createMockNextPostRequest } from '@/test-config/utils'
import { UserRole, UserRoleWithoutAdmin } from '@/types/User'
import UserService from '@/data-layer/services/UserService'
import AuthService from '@/data-layer/services/AuthService'

describe('tests /api/register', () => {
  const userService = new UserService()
  const authService = new AuthService()

  it('should register a new user', async () => {
    const body: RegisterRequestBody = {
      firstName: 'jeffery',
      lastName: 'ji',
      email: 'test@example.com',
      password: 'password123',
      role: UserRoleWithoutAdmin.Client,
    }
    const res = await POST(createMockNextPostRequest('/api/register', body))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CREATED)
    expect(json.message).toBe('User registered successfully')
    expect(json.data).toHaveProperty('id')

    const user = await userService.getUser(json.data.id)
    expect(user.firstName).toEqual(body.firstName)
    expect(user.lastName).toEqual(body.lastName)
    expect(user.email).toEqual(body.email)
    expect(user.role).toEqual(body.role)

    const auth = await authService.getAuthByEmail(body.email)
    expect(auth.password).not.toEqual(body.password)
    expect(auth.type).toEqual('password')
  })

  it('should return a 409 conflict if user already exists', async () => {
    const body: RegisterRequestBody = {
      firstName: 'jeffery',
      lastName: 'ji',
      email: 'test@example.com',
      password: 'password123',
      role: UserRoleWithoutAdmin.Client,
    }
    await POST(createMockNextPostRequest('/api/register', body))

    const res = await POST(createMockNextPostRequest('/api/register', body))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CONFLICT)
    expect(json.error).toBe('A user with that email already exists')
  })

  it('should return a 400 bad request if the payload is invalid', async () => {
    const body = {
      firstName: 'jeffery',
      lastName: 'ji',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Admin,
    }
    await POST(createMockNextPostRequest('/api/register', body))

    const res = await POST(createMockNextPostRequest('/api/register', body))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe('Invalid request body')
  })
})
