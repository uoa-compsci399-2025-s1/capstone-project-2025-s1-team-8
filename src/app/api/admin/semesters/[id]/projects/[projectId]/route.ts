import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { NotFound } from 'payload'
import ProjectService from '@/data-layer/services/ProjectService'
import SemesterService from '@/data-layer/services/SemesterService'
import { Security } from '@/business-layer/middleware/Security'
import { SemesterProject } from '@/payload-types'
import { ProjectSchema, SemesterSchema } from '@/types/Payload'
import { ProjectStatus } from '@/types/Project'

export const PatchSemesterProjectRequestBody = z.object({
  number: z.number().min(1).nullable().optional(),
  project: z.union([z.string(), ProjectSchema]).optional(),
  semester: z.union([z.string(), SemesterSchema]).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  published: z.boolean().optional(),
})

class RouteWrapper {
  /**
   * Updates a semester project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the semester ID.
   * @returns A JSON response containing the projects.
   */
  @Security('jwt', ['admin'])
  static async PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; projectId: string }> },
  ) {
    const { id, projectId } = await params
    const projectService = new ProjectService()
    const semesterService = new SemesterService()

    try {
      let semesterProject: SemesterProject
      const fetchedSemester = await semesterService.getSemester(id)

      try {
        semesterProject = await projectService.getSemesterProject(projectId)
      } catch (error) {
        if (error instanceof NotFound) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: StatusCodes.NOT_FOUND },
          )
        }
        throw error
      }

      const data = PatchSemesterProjectRequestBody.parse(await req.json())
      if (JSON.stringify(semesterProject.semester) !== JSON.stringify(fetchedSemester)) {
        return NextResponse.json(
          { error: 'Project does not belong to this semester' },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const updatedProject = await projectService.updateSemesterProject(projectId, data)
      return NextResponse.json({ data: updatedProject })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * DELETE Method to delete a SemesterProject by ID with a valid affiliated Semester
   *
   * @param _req The request object containing the request body
   * @param id The Semester ID
   * @param projectId The Project ID
   * @returns nothing
   */
  @Security('jwt', ['admin'])
  static async DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; projectId: string }> },
  ) {
    const { id, projectId } = await params
    const projectService = new ProjectService()
    try {
      let fetchedProject
      const semesterService = new SemesterService()
      const fetchedSemester = await semesterService.getSemester(id)
      try {
        const projectService = new ProjectService()
        fetchedProject = await projectService.getSemesterProject(projectId)
      } catch (error) {
        if (error instanceof NotFound) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: StatusCodes.NOT_FOUND },
          )
        }
      }
      if (JSON.stringify(fetchedProject?.semester) === JSON.stringify(fetchedSemester)) {
        await projectService.deleteSemesterProject(projectId)
        return NextResponse.json({ status: StatusCodes.OK })
      } else {
        return NextResponse.json(
          { error: 'SemesterProject not affiliated with Semester' },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
