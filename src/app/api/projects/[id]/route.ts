import { NextResponse } from 'next/server'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { NotFound } from 'payload'
import { z, ZodError } from 'zod'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { Security } from '@/business-layer/middleware/Security'
import type { RequestWithUser } from '@/types/Requests'
import { MediaSchema, UserSchema } from '@/types/Payload'
import { UserRole } from '@/types/User'
import type { User } from '@/payload-types'

export const UpdateProjectRequestBody = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  timestamp: z
    .string()
    .datetime({ message: 'Invalid date format, should be in ISO 8601 format' })
    .optional(),
  clients: z
    .union([
      z.array(z.string()).nonempty('At least one client is required'),
      z.array(UserSchema).nonempty('At least one client is required'),
    ])
    .optional(),
  attachments: z.array(MediaSchema).max(5).optional(),
})

class RouteWrapper {
  /**
   * Fetches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async GET(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()
    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      return NextResponse.json({
        data: project,
        // data: {
        //   ...fetchedForm,
        //   ...fetchedForm.questionResponses?.reduce(
        //     (acc, curr) => {
        //       if (curr.question instanceof Object) {
        //         acc[curr.question.fieldName] = curr
        //       }
        //       return acc
        //     },
        //     {} as Record<string, QuestionResponse>,
        //   ),
        // },
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Patches a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async PATCH(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()
    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      const body = UpdateProjectRequestBody.parse(await req.json())
      const data = await projectDataService.updateProject(id, body)
      return NextResponse.json({ data: data })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      } else if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Invalid request body', details: error.flatten() },
          { status: StatusCodes.BAD_REQUEST },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Deletes a project by its ID.
   *
   * @param req - The request object.
   * @param params - The parameters object containing the project ID.
   */
  @Security('jwt', ['admin', 'client'])
  static async DELETE(req: RequestWithUser, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectDataService = new ProjectDataService()

    try {
      const project = await projectDataService.getProjectById(id)
      if (
        req.user.role !== UserRole.Admin &&
        (project.client as User).id !== req.user.id &&
        !(project.additionalClients as User[])?.some((client) => client.id === req.user.id)
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED })
      }
      await projectDataService.deleteProject(id)
      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'Project not found' }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const GET = RouteWrapper.GET,
  PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
