import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import ProjectService from '@/data-layer/services/ProjectService'

/**
 * Fetches a project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the project ID.
 */

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<Response> => {
  const { projectId } = await params
  const projectService = new ProjectService()

  try {
    const data = await projectService.getProjectById(projectId)
    return NextResponse.json({ data })
  } catch (error) {
    if ((error as Error).message == 'Not Found') {
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}

/**
 * Patches a project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the project ID.
 */
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> => {
  const { projectId } = await params
  const projectService = new ProjectService()
  try {
    const body = await req.json()
    const data = await projectService.updateProject(projectId, body)
    return NextResponse.json({data: data})
  } catch (error) {
    if ((error as Error).message === 'Not Found') {
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
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
 * @param req - The request object.
 * @param params - The parameters object containing the project ID.
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<NextResponse> => {
  const { projectId } = await params
  const projectService = new ProjectService()

  try {
    await projectService.deleteProject(projectId)
    return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
  } catch (error) {
    if ((error as Error).message === 'Not Found') {
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
