import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import ProjectService from '@/data-layer/services/ProjectService'
import { StatusCodes } from 'http-status-codes'
import { Security } from '@/business-layer/middleware/Security'
import { NotFound } from 'payload'

class RouteWrapper {
  /**
   * Fetches all projects
   * @param req - The request object.
   * @param params - The parameters object containing the user ID.
   * @returns A JSON response containing the list of projects and the next page cursor.
   */
  @Security('jwt', ['admin'])
  static async GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectService = new ProjectService()
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    if (limit > 100 || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    try {
      const { docs: projects, nextPage } = await projectService.getProjectsByClientId(
        id,
        limit,
        page,
      )
      return NextResponse.json({ data: projects, nextPage })
    } catch (error) {
      if (error instanceof NotFound && error.message === 'User not found') {
        return NextResponse.json({ error: 'Client not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
