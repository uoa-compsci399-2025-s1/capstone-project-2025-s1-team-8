import { clearCollection, testPayloadObject } from '@/test-config/utils'
import UserService from './UserService'
import {
  adminCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
  studentCreateMock,
} from '@/test-config/mocks/User.mock'

describe('User service test', () => {
  const userService = new UserService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
    await clearCollection(testPayloadObject, 'clientAdditionalInfo')
  })

  describe('user service methods', () => {
    it('create a new admin user', async () => {
      const newUser = await userService.createUser(adminCreateMock)
      const fetchedUser = await testPayloadObject.findByID({
        collection: 'user',
        id: newUser.id,
      })
      expect(newUser).toEqual(fetchedUser)
    })

    it('create a new client user', async () => {
      const newUser = await userService.createUser(clientCreateMock)
      const fetchedUser = await testPayloadObject.findByID({
        collection: 'user',
        id: newUser.id,
      })
      expect(newUser).toEqual(fetchedUser)
    })

    it('create a new student user', async () => {
      const newUser = await userService.createUser(studentCreateMock)
      const fetchedUser = await testPayloadObject.findByID({
        collection: 'user',
        id: newUser.id,
      })
      expect(newUser).toEqual(fetchedUser)
    })

    it('find a user by ID', async () => {
      const createdUser = await userService.createUser(studentCreateMock)
      const fetchedUser = await userService.getUser(createdUser.id)
      expect(fetchedUser).toEqual(createdUser)
    })

    it('find all users', async () => {
      await userService.createUser(adminCreateMock)
      await userService.createUser(clientCreateMock)
      const fetchedUsers = await userService.getAllUsers()
      expect(fetchedUsers.docs.length).toEqual(2)
    })

    it('not found - find user with nonexistent id', async () => {
      await expect(userService.getUser('nonexistent_id')).rejects.toThrow('Not Found')
    })

    it('update a user by ID', async () => {
      const createdUser = await userService.createUser(studentCreateMock)
      const updatedUser = await userService.updateUser(createdUser.id, {
        firstName: 'updated user',
      })
      expect(updatedUser.firstName).toEqual('updated user')
    })

    it('not found - update a user by nonexisting ID', async () => {
      await expect(
        userService.updateUser('non-existing-id', {
          firstName: 'updated user',
        }),
      ).rejects.toThrow('Not Found')
    })

    it('delete a user by ID', async () => {
      const createdUser = await userService.createUser(studentCreateMock)
      await userService.deleteUser(createdUser.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'user',
          id: createdUser.id,
        }),
      ).rejects.toThrow('Not Found')
    })

    it('not found - delete a user by nonexisting ID', async () => {
      await expect(userService.deleteUser('non-existing-id')).rejects.toThrow('Not Found')
    })
  })

  describe('client additional info methods', async () => {
    it('should create client additional info', async () => {
      const createdInfo = await userService.createClientAdditionalInfo(
        clientAdditionalInfoCreateMock,
      )
      const fetchedInfo = await testPayloadObject.findByID({
        collection: 'clientAdditionalInfo',
        id: createdInfo.id,
      })
      expect(createdInfo).toEqual(fetchedInfo)
    })

    it('should get a clients additional info by client ID', async () => {
      const createdInfo = await userService.createClientAdditionalInfo(
        clientAdditionalInfoCreateMock,
      )
      const fetchedInfo = await userService.getClientAdditionalInfo(
        clientAdditionalInfoCreateMock.client.toString(),
      )
      expect(createdInfo).toEqual(fetchedInfo)
    })

    it('should update client additional info', async () => {
      const createdInfo = await userService.createClientAdditionalInfo(
        clientAdditionalInfoCreateMock,
      )
      const updatedInfo = await userService.updateClientAdditionalInfo(createdInfo.id, {
        description: 'im not actually very cool',
      })
      const fetchedInfo = await testPayloadObject.findByID({
        collection: 'clientAdditionalInfo',
        id: createdInfo.id,
      })
      expect(updatedInfo).toEqual(fetchedInfo)
    })

    it('should delete client additional info', async () => {
      const createdInfo = await userService.createClientAdditionalInfo(
        clientAdditionalInfoCreateMock,
      )
      await userService.deleteClientAdditionalInfo(createdInfo.id)
      await expect(
        testPayloadObject.findByID({
          collection: 'clientAdditionalInfo',
          id: createdInfo.id,
        }),
      ).rejects.toThrow('Not Found')
    })
  })
})
