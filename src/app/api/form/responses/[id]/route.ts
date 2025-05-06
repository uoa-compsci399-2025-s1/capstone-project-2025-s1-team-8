import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import { NotFound } from 'payload'

import { Security } from '@/business-layer/middleware/Security'
import FormService from '@/data-layer/services/FormService'
import { RequestWithUser } from '@/types/Requests'
import { UserRole } from '@/types/User'
import { QuestionResponse } from '@/types/Form'

class RouteWrapper {
  @Security('jwt', ['client', 'admin'])
  static async GET(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const formService = new FormService()
    try {
      const fetchedForm = await formService.getFormResponse(id)
      if (
        req.user.role !== UserRole.Admin &&
        fetchedForm.client !== req.user.id &&
        !fetchedForm.otherClients?.includes(req.user.id)
      )
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      return NextResponse.json({
        data: {
          ...fetchedForm,
          ...fetchedForm.questionResponses?.reduce(
            (acc, curr) => {
              if (curr.question instanceof Object) {
                acc[curr.question.fieldName] = curr
              }
              return acc
            },
            {} as Record<string, QuestionResponse>,
          ),
        },
      })
    } catch (error) {
      if (error instanceof NotFound)
        return NextResponse.json(
          { error: 'Form response not found' },
          { status: StatusCodes.NOT_FOUND },
        )
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}
export const GET = RouteWrapper.GET
