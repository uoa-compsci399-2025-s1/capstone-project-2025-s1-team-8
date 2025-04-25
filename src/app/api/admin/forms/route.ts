import { ZodError } from 'zod'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'

import FormService from '@/data-layer/services/FormService'
import { Security } from '@/business-layer/middleware/Security'
import { UpdateFormRequestBody } from '@/types/request-models/FormRequest'
import { UpdateFormData } from '@/types/Collections'

class RouteWrapper {
  /**
   * Updates the form if the request is made by an admin
   *
   * @param _req
   * @returns The updated form
   */
  @Security('jwt', ['admin'])
  static async PATCH(_req: NextRequest) {
    const formService = new FormService()
    try {
      const form = await formService.getForm()
      const body = UpdateFormRequestBody.parse(await _req.json())
      const updatedFormData: UpdateFormData = { ...body }
      const updatedForm = await formService.updateForm(form.id, updatedFormData)
      return NextResponse.json(updatedForm)
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Form not found' }, { status: StatusCodes.NOT_FOUND })
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const PATCH = RouteWrapper.PATCH
