import { NextRequest } from 'next/server'
import { ProjectService } from '@/data-layer/services/ProjectService'
import { StatusCodes } from 'http-status-codes'

/**
 * Fetches a project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the project ID.
 */

export const GET = async (
  req: NextRequest,
  { params }: { params: { projectId: string } },
): Promise<Response> => {
  const { projectId } = await params
  const projectService = new ProjectService()

  try {
    const data = await projectService.getProjectById(projectId)
    return Response.json({ data }, { status: StatusCodes.OK })
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
