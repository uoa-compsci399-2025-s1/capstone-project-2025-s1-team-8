import { NextRequest, NextResponse } from 'next/server'

import FormService from '@/data-layer/services/FormService'
import { Security } from '@/business-layer/middleware/Security'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'

class RouteWrapper {
  /**
   * GET Method to get form.
   *
   * @param _req The request object
   * @returns One form.
   */
  @Security('jwt', ['admin', 'client'])
  static async GET(_req: NextRequest) {
    const formService = new FormService()
    try {
      const form = await formService.getForm()
      const questions = await formService.getAllFormQuestions()
      return NextResponse.json({ data: { form, questions } })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Form not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.log(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
