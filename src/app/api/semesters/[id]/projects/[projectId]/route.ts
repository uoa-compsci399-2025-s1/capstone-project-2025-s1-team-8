import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import { ZodError } from 'zod'
import { PatchSemesterProjectRequestBody } from '@/types/request-models/ProjectRequests'

/**
 * Updates a semester project by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the semester ID.
 * @returns A JSON response containing the list of projects and the next page cursor.
 */
export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string, projectId: string }> }) => {
  const paramData = await params
  const projectService = new ProjectService()
  try{
    const data = PatchSemesterProjectRequestBody.parse(await req.json())
    const updatedProject = await projectService.updateSemesterProject(paramData.projectId, data)
    return NextResponse.json({ data: updatedProject })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    } else if (error instanceof ZodError) {
      console.error('ZodError:', error.errors)
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: StatusCodes.BAD_REQUEST },
        )
        }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}