import { NextRequest, NextResponse } from 'next/server'

import FormService from '@/data-layer/services/FormService'
import { Security } from '@/business-layer/middleware/Security'
import { NotFound } from 'payload'
import { StatusCodes } from 'http-status-codes'
import { CreateProjectData, CreateSemesterProjectData } from '@/types/Collections'
import { ZodError } from 'zod'
import { FormResponseSchema } from '@/types/Payload'
import ProjectService from '@/data-layer/services/ProjectService'
import SemesterService from '@/data-layer/services/SemesterService'

class RouteWrapper {
  /**
   * GET Method to get form.
   *
   * @param _req The request object
   * @returns One form.
   */
  @Security('jwt', ['admin', 'client'])
  static async GET(_req: NextRequest) {
    const formService = new FormService()
    try {
      const form = await formService.getForm()
      return NextResponse.json({ data: form })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Form not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.log(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * POST Method to submit form.
   *
   * @param req The request object
   * @returns The created Semester Project.
   */
  @Security('jwt', ['client', 'admin'])
  static async POST(req: NextRequest) {
    const projectService = new ProjectService()
    const semesterService = new SemesterService()

    try {
      const body = FormResponseSchema.parse(await req.json())
      const projectData: CreateProjectData = {
        ...body,
        timestamp: body.createdAt,
        formResponse: body,
      }
      const createdProject = await projectService.createProject(projectData)
      // this should create a semesterProjectData for every semester the form has picked
      const currentSem = await semesterService.getCurrentSemester()
      const semesterProjectData: CreateSemesterProjectData = {
        ...body,
        status: 'pending',
        project: createdProject,
        semester: currentSem,
        published: false,
      }
      return NextResponse.json({ semesterProjectData }, { status: StatusCodes.CREATED })
    } catch (error) {
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
}

export const GET = RouteWrapper.GET
export const POST = RouteWrapper.POST
