import { NextRequest, NextResponse } from 'next/server'
import ProjectService from '@/data-layer/services/ProjectService'
import { StatusCodes } from 'http-status-codes'
import SemesterService from '@/data-layer/services/SemesterService'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
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
      const semesterService = new SemesterService()
      const fetchedSemester = await semesterService.getSemester(id)
      const fetchedProject = await projectService.getSemesterProject(projectId)
      if (JSON.stringify(fetchedProject.semester) === JSON.stringify(fetchedSemester)) {
        await projectService.deleteSemesterProject(projectId)
        return NextResponse.json({ status: StatusCodes.OK })
      } else {
        return NextResponse.json(
          { error: 'SemesterProject not affiliated with Semester' },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
    } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
    }
  }
}

export const DELETE = RouteWrapper.DELETE
