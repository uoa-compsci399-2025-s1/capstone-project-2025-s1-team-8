import { StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'

import { createMockNextPatchRequest, paramsToPromise } from '@/test-config/utils'
import UserDataService from '@/data-layer/services/UserDataService'
import {
  adminCreateMock,
  studentCreateMock,
  clientAdditionalInfoCreateMock,
  clientCreateMock,
} from '@/test-config/mocks/User.mock'
import { GET, PATCH, DELETE } from '@/app/api/admin/users/[id]/route'
import type { UserCombinedInfo } from '@/types/Collections'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import type { User } from '@/payload-types'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { projectCreateMock, semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'

describe('test /api/admin/users/[id]', async () => {
  const userDataService = new UserDataService()
  const projectDataService = new ProjectDataService()
  const cookieStore = await cookies()

  describe('test GET /api/admin/users/[id]', () => {
    it('should return a 401 if no auth cookie', async () => {
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'test' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'test' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('fetch client by Id', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const clientMock = await userDataService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userDataService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id = (clientAdditionalInfoMock.client as User).id

      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id }),
      })

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...clientMock,
        introduction: clientAdditionalInfoMock.introduction,
        affiliation: clientAdditionalInfoMock.affiliation,
      })
    })

    it('fetch generic user by Id', async () => {
      const newClient = await userDataService.createUser(adminCreateMock)
      const newClientInfo = await userDataService.createClientAdditionalInfo({
        ...adminCreateMock,
        client: newClient,
      })

      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: newClient.id }),
      })

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...newClient,
        introduction: newClientInfo.introduction,
        affiliation: newClientInfo.affiliation,
      })
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })

  describe('tests PATCH /api/admin/users/[id]', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: '1' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'eee' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'eee' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it("update client user's firstName by Id", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const clientMock = await userDataService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userDataService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id = (clientAdditionalInfoMock.client as User).id
      const res = await PATCH(
        createMockNextPatchRequest(`api/admin/users/${id}`, {
          firstName: 'Sheena Lin',
        }),
        {
          params: paramsToPromise({ id }),
        },
      )
      const json = await res.json()

      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        firstName: 'Sheena Lin',
        introduction: clientAdditionalInfoCreateMock.introduction,
        affiliation: clientAdditionalInfoCreateMock.affiliation,
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update client user by Id with existing introduction and affiliation', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const clientMock = await userDataService.createUser(clientCreateMock)
      const clientAdditionalInfoMock = await userDataService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: clientMock,
      })
      const id = (clientAdditionalInfoMock.client as User).id
      const payload = {
        firstName: 'Sheena Lin',
        introduction: 'new intro',
        affiliation: 'new affiliation',
      }

      const res = await PATCH(createMockNextPatchRequest(`api/admin/users/${id}`, payload), {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()

      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        firstName: 'Sheena Lin',
        introduction: 'new intro',
        affiliation: 'new affiliation',
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update client user by Id with no AdditionalClientInfo', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const clientMock = await userDataService.createUser(clientCreateMock)
      const id = clientMock.id

      const res = await PATCH(
        createMockNextPatchRequest('api/admin/users/' + id, { firstName: 'Sheenaaaaaa' }),
        {
          params: paramsToPromise({ id }),
        },
      )
      const json = await res.json()

      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        firstName: 'Sheenaaaaaa',
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update name, intro, affiliation of client user by Id with no AdditionalClientInfo', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const clientMock = await userDataService.createUser(clientCreateMock)
      const id = clientMock.id
      const payload = {
        firstName: 'Sheenaaaaaa',
        introduction: 'introooo',
        affiliation: 'afil',
      }

      const res = await PATCH(createMockNextPatchRequest(`api/admin/users/${id}`, payload), {
        params: paramsToPromise({ id }),
      })
      const json = await res.json()

      const combinedClientInfo: UserCombinedInfo = {
        ...clientMock,
        firstName: 'Sheenaaaaaa',
        introduction: 'introooo',
        affiliation: 'afil',
        updatedAt: json.data.updatedAt,
      }
      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(combinedClientInfo)
    })

    it('update student user by Id', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const userDataService = new UserDataService()
      const newStudent = await userDataService.createUser(studentCreateMock)
      const id = newStudent.id

      const res = await PATCH(
        createMockNextPatchRequest(`api/admin/users/${id}`, { firstName: 'Sheena' }),
        {
          params: paramsToPromise({ id }),
        },
      )
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual({
        ...newStudent,
        firstName: 'Sheena',
        updatedAt: json.data.updatedAt,
      })
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'User not found' })
    })
  })

  describe('tests DELETE /api/admin/users/[id]', () => {
    it('should return a 401 if the user is not authenticated', async () => {
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a client or student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })

      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res2 = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res2.json()).toEqual({ error: 'No scope' })
    })

    it('should delete a user', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(clientCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userDataService.getUser(newUser.id)).rejects.toThrow('Not Found')
    })

    it('should delete a user and the related client additional info', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(clientCreateMock)
      const additionalInfo = await userDataService.createClientAdditionalInfo({
        ...clientAdditionalInfoCreateMock,
        client: newUser,
      })
      expect(await userDataService.getClientAdditionalInfo(newUser.id)).toStrictEqual(
        additionalInfo,
      )
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userDataService.getUser(newUser.id)).rejects.toThrow('Not Found')
      expect(await userDataService.getClientAdditionalInfo(newUser.id)).toBeUndefined()
    })

    it('should delete a user and related projects', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(clientCreateMock)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: newUser,
      })
      const project2 = await projectDataService.createProject({
        ...projectCreateMock,
        client: newUser,
      })

      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newUser.id }),
      })

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userDataService.getUser(newUser.id)).rejects.toThrow('Not Found')
      expect(await userDataService.getClientAdditionalInfo(newUser.id)).toBeUndefined()
      await expect(projectDataService.getProjectById(project.id)).rejects.toThrow('Not Found')
      await expect(projectDataService.getProjectById(project2.id)).rejects.toThrow('Not Found')
    })

    it('should delete a user and related semester projects', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(clientCreateMock)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: newUser,
      })
      const project2 = await projectDataService.createProject({
        ...projectCreateMock,
        client: newUser,
      })
      const semesterProject = await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        project,
      })
      const semesterProject2 = await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        project: project2,
      })

      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newUser.id }),
      })

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userDataService.getUser(newUser.id)).rejects.toThrow('Not Found')
      expect(await userDataService.getClientAdditionalInfo(newUser.id)).toBeUndefined()
      await expect(projectDataService.getSemesterProject(semesterProject.id)).rejects.toThrow(
        'Not Found',
      )
      await expect(projectDataService.getSemesterProject(semesterProject2.id)).rejects.toThrow(
        'Not Found',
      )
    })

    it('should return a 404 error if the user does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE({} as NextRequest, { params: paramsToPromise({ id: 'noid' }) })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
