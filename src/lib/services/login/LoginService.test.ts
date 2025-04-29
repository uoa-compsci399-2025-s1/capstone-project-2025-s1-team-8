import LoginService from './LoginService'
import { clientMock } from '@/test-config/mocks/Auth.mock'
import UserService from '@/data-layer/services/UserService'
import AuthService from '@/business-layer/services/AuthService'
import AuthDataService from '@/data-layer/services/AuthService'

describe('tests LoginService', () => {
  const userService = new UserService()
  const authService = new AuthService()
  const authDataService = new AuthDataService()

  it('should successfully login a user', async () => {
    await userService.createUser(clientMock)
    await authDataService.createAuth({
      email: clientMock.email,
      password: await authService.hashPassword('password123'),
      type: 'password',
    })
    const response = await LoginService.login({
      email: clientMock.email,
      password: 'password123',
    })
    expect(response.message).toBe('Login successful')
  })

  it('should return BAD_REQUEST if request body is invalid', async () => {
    await userService.createUser(clientMock)
    await authDataService.createAuth({
      email: clientMock.email,
      password: await authService.hashPassword('password123'),
      type: 'password',
    })
    const response = await LoginService.login({
      email: clientMock.email,
      password: 'password13',
    })
    expect(response.error).toBe('Invalid email or password')
  })
})
