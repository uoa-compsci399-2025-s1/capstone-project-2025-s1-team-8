import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import { ZodError } from 'zod'
import { PatchSemesterProjectRequestBody } from '@/types/request-models/ProjectRequests'
import SemesterService from '@/data-layer/services/SemesterService'

/**
 * Updates a semester project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the semester ID.
 * @returns A JSON response containing the projects.
 */
export const PATCH = async (
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
      return NextResponse.json(
        { error: 'Project not found!' },
        { status: StatusCodes.NOT_FOUND },
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  try {
    fetchedSemester = await semesterService.getSemester(id)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json(
        { error: 'Semester not found!' },
        { status: StatusCodes.NOT_FOUND },
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  try {
    const data = PatchSemesterProjectRequestBody.parse(await req.json())
    if (JSON.stringify(project.semester) !== JSON.stringify(fetchedSemester)) {
      return NextResponse.json(
        { error: 'Project does not belong to this semester' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    const updatedProject = await projectService.updateSemesterProject(projectId, data)
    return NextResponse.json({ data: updatedProject })
  } catch (error) {
     if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
