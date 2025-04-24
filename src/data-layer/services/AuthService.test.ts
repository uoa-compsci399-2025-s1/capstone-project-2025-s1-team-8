import { testPayloadObject } from '@/test-config/utils'
import AuthService from './AuthService'
import { authCreateMock } from '@/test-config/mocks/Auth.mock'

describe('Project service methods test', () => {
  const authService = new AuthService()

  it('should create an auth', async () => {
    const newAuthentication = await authService.createAuth(authCreateMock)
    const fetchedAuthentication = await testPayloadObject.findByID({
      collection: 'authentication',
      id: newAuthentication.id,
    })
    expect(newAuthentication).toEqual(fetchedAuthentication)
  })

  it('should get an auth', async () => {
    const newAuthentication = await authService.createAuth(authCreateMock)
    const fetchedAuthentication = await authService.getAuth(newAuthentication.id)
    expect(newAuthentication).toEqual(fetchedAuthentication)
  })

  it('should return undefined if auth does not exist', async () => {
    await expect(authService.getAuth('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should get an auth doc by email', async () => {
    const newAuthentication = await authService.createAuth(authCreateMock)
    const fetchedAuthentication = await authService.getAuthByEmail(newAuthentication.email)
    expect(newAuthentication).toEqual(fetchedAuthentication)
  })

  it('should update a auth', async () => {
    const newAuth = await authService.createAuth(authCreateMock)
    const updatedAuth = await authService.updateAuth(newAuth.id, {
      accessToken: 'Updated token',
    })
    expect(updatedAuth.accessToken).toEqual('Updated token')
  })

  it('should delete a auth', async () => {
    const newAuth = await authService.createAuth(authCreateMock)
    await authService.deleteAuth(newAuth.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'authentication',
        id: newAuth.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if auth does not exist', async () => {
    await expect(authService.deleteAuth('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
