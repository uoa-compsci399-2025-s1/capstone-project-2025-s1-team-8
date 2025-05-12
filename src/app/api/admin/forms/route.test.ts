import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import FormService from '@/data-layer/services/FormService'
import { PATCH } from './route'
import { createMockNextPatchRequest, createMockNextPostRequest } from '@/test-config/utils'
import { formMock } from '@/test-config/mocks/Form.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/admin/forms', async () => {
  const formService = new FormService()
  const cookieStore = await cookies()

  describe('PATCH /api/admin/forms', () => {
    it('should return a 401 Unauthorized error if not authenticated', async () => {
      const res = await PATCH(createMockNextPostRequest('', formMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await res.json()
      expect(json.error).toEqual('No token provided')
    })

    it('should return a 401 if user is student or client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await PATCH(createMockNextPostRequest('', formMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      const json = await res.json()
      expect(json.error).toEqual('No scope')

      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res2 = await PATCH(createMockNextPostRequest('', formMock))
      expect(res2.status).toBe(StatusCodes.UNAUTHORIZED)
      const json2 = await res2.json()
      expect(json2.error).toEqual('No scope')
    })

    it('should update a form', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const body = { name: 'updated name', description: 'updated description' }
      const form1 = await formService.createForm(formMock)
      const mockedReq = createMockNextPatchRequest('api/admin/forms/' + form1.id, body)
      const res = await PATCH(mockedReq)
      const json = await res.json()
      expect(json.data.name).toEqual('updated name')
      expect(json.data.description).toEqual('updated description')
    })

    it('return error for invalid body', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await formService.createForm(formMock)
      const invalidBody = { name: 123, description: true }
      const mockedReq = createMockNextPatchRequest('api/admin/forms/1', invalidBody)
      const res = await PATCH(mockedReq)
      const json = await res.json()
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(json.error).toEqual('Invalid request body')
      expect(json.details).toBeDefined()
    })
  })
})
