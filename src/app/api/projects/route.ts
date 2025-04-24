import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import ProjectService from '@/data-layer/services/ProjectService'
import { CreateProjectRequestBody } from '@/types/request-models/ProjectRequests'
import { CreateProjectData } from '@/types/Collections'
import { ZodError } from 'zod'

/**
 * Fetches all projects
 * @param req - The request object.
 * @returns A JSON response containing the list of projects and the next page cursor.
 */

export const GET = async (req: NextRequest) => {
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
  const { docs: projects, nextPage } = await projectService.getAllProjects(limit, page)
  return NextResponse.json({ data: projects, nextPage })
}

/**
 * Creates a project by its ID.
 * @param req - The request object.
 * @returns A JSON response containing the created project.
 */
export const POST = async (req: NextRequest) => {
  const projectService = new ProjectService()

  try {
    const body = CreateProjectRequestBody.parse(await req.json())
    const data = await projectService.createProject(body as CreateProjectData)
    return NextResponse.json({ data }, { status: StatusCodes.CREATED })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: 'Bad request body' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
