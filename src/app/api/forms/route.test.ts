import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import FormService from '@/data-layer/services/FormService'
import { GET, POST } from './route'
import { createMockNextPostRequest, createMockNextRequest } from '@/test-config/utils'
import { formMock, formResponseMock } from '@/test-config/mocks/Form.mock'
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

  describe('POST /api/forms', () => {
    it('return a 401 if not authenticated', async () => {
      const res = await POST(createMockNextRequest('http://localhost:3000/api/forms/'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('return semester project when client sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const createdFormResponse = await formService.createFormResponse(formResponseMock)
      const req = createMockNextPostRequest('https://localhost:3000/api/forms', {
        ...createdFormResponse,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      console.log((await res.json()).data)
    })

    it('return semester project when admin sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const createdFormResponse = await formService.createFormResponse(formResponseMock)
      const req = createMockNextPostRequest('https://localhost:3000/api/forms', {
        ...createdFormResponse,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      console.log((await res.json()).data)
    })

    it('return 401 when student sends request', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const createdFormResponse = await formService.createFormResponse(formResponseMock)
      const req = createMockNextPostRequest('https://localhost:3000/api/forms', {
        ...createdFormResponse,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('return 404 when form not found', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const createdFormResponse = await formService.createFormResponse(formResponseMock)
      const req = createMockNextPostRequest('https://localhost:3000/api/forms', {
        ...createdFormResponse,
        description: undefined,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })
  })
})
