import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import FormService from '@/data-layer/services/FormService'
import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { formMock } from '@/test-config/mocks/Form.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'

describe('tests /api/forms', async () => {
  const formService = new FormService()
  const cookieStore = await cookies()

  describe('GET /api/forms', () => {
    it('return a 401 if not authenticated', async () => {
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms/'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('return 401 when student sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      await formService.createForm(formMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')
    })

    it('return form when client sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await formService.createForm(formMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms'))
      expect(res.status).toBe(StatusCodes.OK)
      const form = (await res.json()).data
      expect(form.name).toEqual(formMock.name)
    })

    it('return form when admin sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await formService.createForm(formMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms'))
      expect(res.status).toBe(StatusCodes.OK)
      const form = (await res.json()).data
      expect(form.name).toEqual(formMock.name)
    })

    it('return 401 when student sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      await formService.createForm(formMock)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('return 404 when form not found', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('http://localhost:3000/api/forms'))
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe('Form not found')
    })
  })
})
