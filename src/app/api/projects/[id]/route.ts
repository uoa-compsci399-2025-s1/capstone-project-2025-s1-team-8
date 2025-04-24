import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import { UpdateProjectRequestBody } from '@/types/request-models/ProjectRequests'
import { ZodError } from 'zod'
import { Security } from '@/business-layer/middleware/Security'
import { UserCombinedInfo } from '@/types/Collections'

class RouteWrapper {
  /**
   * Fetches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async GET(
    _req: NextRequest & { user: UserCombinedInfo },
    { params }: { params: Promise<{ id: string }> },
  ) {
    const { id } = await params
    const projectService = new ProjectService()
    try {
      const data = await projectService.getProjectById(id)
      return NextResponse.json({ data })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Patches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async PATCH(
    req: NextRequest & { user: UserCombinedInfo },
    { params }: { params: Promise<{ id: string }> },
  ) {
    const { id } = await params
    const projectService = new ProjectService()
    try {
      const fetchedProject = await projectService.getProjectById(id)
      if (!fetchedProject.clients.includes(req.user.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      const body = UpdateProjectRequestBody.parse(await req.json())
      const data = await projectService.updateProject(id, body)
      return NextResponse.json({ data: data })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
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

  /**
   * Deletes a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectService = new ProjectService()

    try {
      await projectService.deleteProject(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET,
  PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
