import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import { NotFound } from 'payload'

import ProjectService from '@/data-layer/services/ProjectService'
import { Semester, SemesterProject } from '@/payload-types'
import { Security } from '@/business-layer/middleware/Security'
import { RequestWithUser } from '@/types/Requests'
import { UserRole } from '@/types/User'

class RouteWrapper {
  @Security('jwt', ['admin', 'client'])
  static async GET(
    req: RequestWithUser,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const projectService = new ProjectService()
    try {
      const project = await projectService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        project.client !== req.user.id &&
        !project.additionalClients?.includes(req.user.id)
      ) {
        return NextResponse.json(
          { error: 'This project is not associated with the requesting client' },
          { status: StatusCodes.UNAUTHORIZED },
        )
      }
      const semesterProjects = await projectService.getSemesterProjectsByProject(project.id)
      const semesters: Set<Semester> = new Set()
      semesterProjects.forEach((semesterProject: SemesterProject) => {
        semesters.add(semesterProject.semester as Semester)
      })
      return NextResponse.json({
        data: [...semesters],
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}
export const GET = RouteWrapper.GET
