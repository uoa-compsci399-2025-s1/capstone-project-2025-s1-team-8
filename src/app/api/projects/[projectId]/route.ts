import { NextRequest } from 'next/server'
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
    return Response.json({ data })
  } catch (error) {
    if ((error as Error).message == 'Not Found') {
      return Response.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<Response> => {
  const { projectId } = await params
  const projectService = new ProjectService()

  try {
    await projectService.deleteProject(projectId)
    return new Response(null, { status: StatusCodes.NO_CONTENT })
  } catch (error) {
    if ((error as Error).message == 'Not Found') {
      return Response.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
    console.error(error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
