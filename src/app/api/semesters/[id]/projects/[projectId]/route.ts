import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import { NotFound } from 'payload'
import SemesterService from '@/data-layer/services/SemesterService'
import type { SemesterProject } from '@/payload-types'
import { Security } from '@/business-layer/middleware/Security'
import type { RequestWithUser } from '@/types/Requests'
import { UserRole } from '@/types/User'

class RouteWrapper {
  /**
   * Gets a semester project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the semester ID and project ID.
   * @returns A JSON response containing the project data
   */
  @Security('jwt', ['student', 'admin'])
  static async GET(
    req: RequestWithUser,
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
        if (req.user.role === UserRole.Student) {
          if (!semesterProject.published) {
            return NextResponse.json({ error: 'No scope' }, { status: StatusCodes.UNAUTHORIZED })
          }
        }
      } catch (error) {
        if (error instanceof NotFound) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: StatusCodes.NOT_FOUND },
          )
        }
        throw error
      }

      if (JSON.stringify(semesterProject.semester) !== JSON.stringify(fetchedSemester)) {
        return NextResponse.json(
          { error: 'Project is not associated with semester' },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      return NextResponse.json({ data: semesterProject })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error('Error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
