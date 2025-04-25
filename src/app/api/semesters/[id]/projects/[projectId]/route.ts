import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import { SemesterSchema } from '@/types/Payload'

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
  try {
    const project = await projectService.getSemesterProject(projectId)
    if (typeof project.semester === "string" && project.semester !== id) {
      return NextResponse.json(
        { error: 'Project not found in this semester' },
        { status: StatusCodes.NOT_FOUND },
      )
    }

    const semester = SemesterSchema.safeParse(project.semester)
    if (semester.success) {
      if (semester.data.id !== id) {
        return NextResponse.json(
          { error: 'Project not found in this semester' },
          { status: StatusCodes.NOT_FOUND },
        )
      }
    }
    return NextResponse.json({ data: project })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
