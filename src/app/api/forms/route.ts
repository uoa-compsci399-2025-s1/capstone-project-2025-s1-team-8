import { NextRequest, NextResponse } from 'next/server'

import FormService from '@/data-layer/services/FormService'
import { Security } from '@/business-layer/middleware/Security'

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
    const form = await formService.getForm()
    return NextResponse.json({ data: form })
  }
}

export const GET = RouteWrapper.GET
