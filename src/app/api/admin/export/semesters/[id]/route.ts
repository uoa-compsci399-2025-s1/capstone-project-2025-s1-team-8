import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { NotFound } from 'payload'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import ProjectService from '@/data-layer/services/ProjectService'
import type {
  Project,
  Semester,
  SemesterProject as SemesterProjectType,
  User,
} from '@/payload-types'
import { Security } from '@/business-layer/middleware/Security'

class RouteWrapper {
  /**
   * GET Method to get semesters.
   *
   * @param req The request object
   * @returns All semesters.
   */
  @Security('jwt', ['admin'])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectService = new ProjectService()
    try {
      let projects = await projectService.getAllSemesterProjectsBySemester(id)
      const allSemesterProjects: SemesterProjectType[] = [...projects.docs]
      while (projects.nextPage) {
        allSemesterProjects.push(...projects.docs)
        projects = await projectService.getAllSemesterProjectsBySemester(id, 100, projects.nextPage)
      }
      // client, additionalClients, deadline, desiredOutput, specialEquipmentRequirements, numberOfTeams, desiredTeamSkills, availableResources, futureConsideration
      const csvHeaders = [
        'id',
        'number',
        'semester',
        'project',
        'status',
        'published',
        'updatedAt',
        'createdAt',
        // Project related fields
        'client',
        'additionalClients',
        'deadline',
        'desiredOutput',
        'specialEquipmentRequirements',
        'numberOfTeams',
        'desiredTeamSkills',
        'availableResources',
        'futureConsideration',
      ]

      const csvRows = [csvHeaders]

      for (const project of allSemesterProjects) {
        // eslint-disable-next-line
        const unpackedProject = { ...project, ...(project as any)['project'] } as any
        console.log('Unpacked project:', unpackedProject)
        const row = csvHeaders.map((field) => {
          const value = unpackedProject[field]

          switch (field) {
            case 'project':
              return JSON.stringify((value as Project)?.name) || 'Project not found'
            case 'semester':
              return JSON.stringify((value as Semester)?.name) || 'Semester not found'
            case 'published':
              return value ? 'yes' : 'no'
            case 'id':
              return JSON.stringify(`UUID: ${value}`)
            case 'updatedAt':
              return JSON.stringify(new Date(value).toLocaleString())
            case 'createdAt':
              return JSON.stringify(new Date(value).toLocaleString())
            // left joined fields
            case 'client':
              const client = value as User
              return (
                JSON.stringify(`${client.firstName} ${client.lastName ?? ''}`) || 'Client not found'
              )
            case 'additionalClients':
              const additionalClients = (value || []) as User[]
              if (additionalClients && additionalClients.length > 0) {
                return JSON.stringify(
                  additionalClients.map((client) => `${client.firstName} ${client.lastName ?? ''}`),
                )
              }
              return 'No additional clients'
            case 'deadline':
              return value ? JSON.stringify(new Date(value).toLocaleDateString()) : 'No deadline'
            default:
              return JSON.stringify(value ?? 'N/A')
          }
        })

        csvRows.push(row)
      }

      const csvData = csvRows.map((row) => row.join(',')).join('\n')
      return new NextResponse(csvData, {
        status: StatusCodes.OK,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="data.csv"',
        },
      })
    } catch (error) {
      if (error instanceof NotFound)
        return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
      console.log(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET
