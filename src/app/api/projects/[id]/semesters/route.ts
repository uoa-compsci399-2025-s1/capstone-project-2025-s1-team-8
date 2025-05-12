import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import { NotFound } from 'payload'
import { z } from 'zod'

import ProjectService from '@/data-layer/services/ProjectService'
import { Semester, SemesterProject, User } from '@/payload-types'
import { Security } from '@/business-layer/middleware/Security'
import { RequestWithUser } from '@/types/Requests'
import { UserRole } from '@/types/User'
import { CommonResponse } from '@/types/response-models/CommonResponse'

export const GetProjectSemestersResponseSchema = CommonResponse.extend({
  data: z.array(z.custom<Semester>()),
})
export type GetProjectSemestersResponse = z.infer<typeof GetProjectSemestersResponseSchema>

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
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json(
          {
            error: 'This project is not associated with the requesting client',
          } as GetProjectSemestersResponse,
          { status: StatusCodes.UNAUTHORIZED },
        )
      }

      const semesterProjects = await projectService.getSemesterProjectsByProject(project.id)
      const semestersMap: Map<string, Semester> = new Map()
      semesterProjects.forEach((semesterProject: SemesterProject) => {
        const semester = semesterProject.semester as Semester
        if (semester && semester.id) {
          semestersMap.set(semester.id, semester)
        }
      })

      return NextResponse.json({
        data: Array.from(semestersMap.values()),
      } as GetProjectSemestersResponse)
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' } as GetProjectSemestersResponse, {
          status: StatusCodes.NOT_FOUND,
        })
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}
export const GET = RouteWrapper.GET
