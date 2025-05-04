import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { GET } from './route'
import { createMockNextRequest, paramsToPromise } from '@/test-config/utils'
import FormService from '@/data-layer/services/FormService'
import {
  formQuestionMock,
  formResponseMock,
  questionResponseMock,
} from '@/test-config/mocks/Form.mock'
import { clientMock } from '@/test-config/mocks/Auth.mock'

describe('tests /api/form/responses/[id]', async () => {
  const cookieStore = await cookies()
  const formService = new FormService()

  describe('GET /api/form/responses/[id]', () => {
    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('/api/form/responses/123'), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })
    })

    it("should 401 if the form isn't associated with the user", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const formResponse = await formService.createFormResponse(formResponseMock)
      const res = await GET(createMockNextRequest('/api/form/responses/123'), {
        params: paramsToPromise({ id: formResponse.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'Unauthorized' })
    })

    it('should return the form response data and unpack question responses', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const question = await formService.createFormQuestion(formQuestionMock)
      const formResponse = await formService.createFormResponse({
        ...formResponseMock,
        questionResponses: [{ ...questionResponseMock, question: question }],
        client: clientMock,
      })
      const res = await GET(createMockNextRequest('/api/form/responses/123'), {
        params: paramsToPromise({ id: formResponse.id }),
      })
      const json = await res.json()
      expect(json.data).toEqual({
        ...formResponse,
        ...formResponse.questionResponses?.reduce(
          (acc, curr) => {
            if (curr.question instanceof Object) {
              acc[curr.question?.fieldName] = curr
            }
            return acc
          },
          {} as Record<string, unknown>,
        ),
      })
    })

    it('should allow admins to fetch any form response', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const question = await formService.createFormQuestion(formQuestionMock)
      const formResponse = await formService.createFormResponse({
        ...formResponseMock,
        questionResponses: [{ ...questionResponseMock, question: question }],
      })
      const res = await GET(createMockNextRequest('/api/form/responses/123'), {
        params: paramsToPromise({ id: formResponse.id }),
      })
      expect((await res.json()).data).toEqual({
        ...formResponse,
        ...formResponse.questionResponses?.reduce(
          (acc, curr) => {
            if (curr.question instanceof Object) {
              acc[curr.question?.fieldName] = curr
            }
            return acc
          },
          {} as Record<string, unknown>,
        ),
      })
    })
  })
})
