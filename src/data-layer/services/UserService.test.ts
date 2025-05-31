import { testPayloadObject } from '@/test-config/utils'
import UserService from './UserService'
import {
  adminCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
  studentCreateMock,
} from '@/test-config/mocks/User.mock'

describe('User service test', () => {
  const userService = new UserService()

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

    it('should return a paginated list of users', async () => {
      await userService.createUser(clientCreateMock)
      await userService.createUser(adminCreateMock)
      const fetchedUsers = await userService.getAllUsers({ limit: 3 })

      expect(fetchedUsers.docs.length).toEqual(3)
      expect(fetchedUsers.hasNextPage).toBeTruthy()

      const nextPage = await userService.getAllUsers({
        limit: 3,
        page: fetchedUsers.nextPage ? fetchedUsers.nextPage : undefined,
      })

      expect(nextPage.docs.length).toEqual(2)
      expect(nextPage.hasNextPage).toBeFalsy()

      expect(nextPage.docs[0].id).not.toEqual(fetchedUsers.docs[0].id)
    })

    it('should find all users with a certain first name', async () => {
      const userMock = await userService.createUser({
        ...clientCreateMock,
        firstName: 'searchforme',
      })
      const userMock2 = await userService.createUser({
        ...clientCreateMock,
        firstName: 'searchforme2',
      })
      await userService.createUser({
        ...clientCreateMock,
        firstName: 'shouldnt find me',
      })

      const fetchedUsers = await userService.getAllUsers({ query: 'searchforme' })
      expect(fetchedUsers.docs.length).toEqual(2)
      expect(fetchedUsers.docs).toEqual(expect.arrayContaining([userMock, userMock2]))
    })

    it('should find all users with a certain last name', async () => {
      const userMock = await userService.createUser({
        ...clientCreateMock,
        lastName: 'cool',
      })
      const userMock2 = await userService.createUser({
        ...clientCreateMock,
        lastName: 'coollll',
      })
      await userService.createUser({
        ...clientCreateMock,
        lastName: 'col',
      })
      await userService.createUser({
        ...clientCreateMock,
        firstName: 'searchforme2',
        lastName: 'dontfindme',
      })

      const fetchedUsers = await userService.getAllUsers({ query: 'cool' })
      expect(fetchedUsers.docs.length).toEqual(2)
      expect(fetchedUsers.docs).toEqual(expect.arrayContaining([userMock, userMock2]))
    })

    it('should find all users with a certain first name and last name', async () => {
      const userMock = await userService.createUser({
        ...clientCreateMock,
        firstName: 'very',
        lastName: 'cool',
      })
      await userService.createUser({
        ...clientCreateMock,
        lastName: 'col',
      })
      await userService.createUser({
        ...clientCreateMock,
        firstName: 'searchforme2',
        lastName: 'dontfindme',
      })

      const fetchedUsers = await userService.getAllUsers({ query: 'very coo' })
      expect(fetchedUsers.docs).toStrictEqual([userMock])
    })

    it('should ignore double spacing during full name queries', async () => {
      const userMock = await userService.createUser({
        ...clientCreateMock,
        firstName: 'foo',
        lastName: 'bar',
      })

      const fetchedUsers = await userService.getAllUsers({ query: 'foo  bar' })
      expect(fetchedUsers.docs).toStrictEqual([userMock])
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

  describe('client additional info methods', () => {
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

    it('should return undefined if no client additional info is found', async () => {
      expect(await userService.getClientAdditionalInfo('nonexistent_id')).toBeUndefined()
    })

    it('should update client additional info', async () => {
      const createdInfo = await userService.createClientAdditionalInfo(
        clientAdditionalInfoCreateMock,
      )
      const updatedInfo = await userService.updateClientAdditionalInfo(createdInfo.id, {
        introduction: 'im not actually very cool',
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
