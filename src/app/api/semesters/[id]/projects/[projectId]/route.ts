import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import SemesterService from '@/data-layer/services/SemesterService'

/**
 * Gets a semester project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the semester ID and project ID.
 * @returns A JSON response containing the project data
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; projectId: string }> },
) => {
  const { id, projectId } = await params
  const projectService = new ProjectService()
  const semesterService = new SemesterService()
  let project
  let fetchedSemester

  try {
    project = await projectService.getSemesterProject(projectId)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'Project not found!' }, { status: StatusCodes.NOT_FOUND })
    }
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  try {
    fetchedSemester = await semesterService.getSemester(id)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'Semester not found!' }, { status: StatusCodes.NOT_FOUND })
    }
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
  if (JSON.stringify(project.semester) !== JSON.stringify(fetchedSemester)) {
    return NextResponse.json(
      { error: 'Project is not associated with semester!' },
      { status: StatusCodes.BAD_REQUEST },
    )
  }
  return NextResponse.json({ data: project })
}
