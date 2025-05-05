import { z, ZodError } from 'zod'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import FormService from '@/data-layer/services/FormService'
import { Security } from '@/business-layer/middleware/Security'
import { UpdateFormData } from '@/types/Collections'

export const UpdateFormRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

class RouteWrapper {
  /**
   * Updates the form if the request is made by an admin
   *
   * @param req
   * @returns The updated form
   */
  @Security('jwt', ['admin'])
  static async PATCH(req: NextRequest) {
    const formService = new FormService()
    try {
      const body = UpdateFormRequestBody.parse(await req.json())
      const updatedForm = await formService.updateForm(body as UpdateFormData)
      return NextResponse.json({ data: updatedForm })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Form not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const PATCH = RouteWrapper.PATCH
