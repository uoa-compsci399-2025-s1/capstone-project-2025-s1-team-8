import { z, ZodError } from 'zod'
import { NotFound } from 'payload'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import UserDataService from '@/data-layer/services/UserDataService'
import { UserRole } from '@/types/User'
import type { UserCombinedInfo } from '@/types/Collections'
import { Security } from '@/business-layer/middleware/Security'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import AuthDataService from '@/data-layer/services/AuthDataService'

export const UpdateUserRequestBodySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  email: z.string().optional(),
  introduction: z.string().optional(),
  affiliation: z.string().optional(),
})

export type UpdateUserRequestBody = z.infer<typeof UpdateUserRequestBodySchema>

class RouteWrapper {
  /**
   * Fetches a single user by ID if the request is made by an admin
   *
   * @param param0 The ID of the user to fetch
   * @param _req the NextRequest obj
   * @returns The user data
   */
  @Security('jwt', ['admin'])
  static async GET(
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const userDataService = new UserDataService()
    try {
      const user = await userDataService.getUser(id)
      if (user.role === UserRole.Client) {
        const { introduction, affiliation } = {
          ...(await userDataService.getClientAdditionalInfo(id)),
        }
        return NextResponse.json({ data: { ...user, introduction, affiliation } })
      }
      return NextResponse.json({ data: user })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
      }
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }

  /**
   * Updates a single user by ID if the request is made by an admin
   *
   * @param param0 The ID of the user to update
   * @param req The next request containing the updated user information
   * @returns The updated user
   */
  @Security('jwt', ['admin'])
  static async PATCH(
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>
    },
  ) {
    const { id } = await params
    const userDataService = new UserDataService()
    try {
      const user = await userDataService.getUser(id)
      const body = UpdateUserRequestBodySchema.parse(await req.json())
      const updatedUser = await userDataService.updateUser(id, body)
      const { introduction: bodyIntroduction, affiliation: bodyAffiliation } = body
      if (user.role === UserRole.Client || user.role === UserRole.Admin) {
        let clientInfo = await userDataService.getClientAdditionalInfo(id)
        if (!clientInfo) {
          clientInfo = await userDataService.createClientAdditionalInfo({
            client: updatedUser,
            introduction: bodyIntroduction,
            affiliation: bodyAffiliation,
          })
        } else {
          clientInfo = await userDataService.updateClientAdditionalInfo(clientInfo.id, {
            ...updatedUser,
            introduction: bodyIntroduction,
            affiliation: bodyAffiliation,
          })
        }
        const { introduction, affiliation } = { ...clientInfo }
        return NextResponse.json({
          data: { ...updatedUser, introduction, affiliation } as UserCombinedInfo,
        })
      }
      return NextResponse.json({ data: updatedUser as UserCombinedInfo })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
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
   * Method to delete a user by Id.
   *
   * @param req The request object containing the request body
   * @returns No content status code
   */
  @Security('jwt', ['admin'])
  static async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const userDataService = new UserDataService()
    const projectDataService = new ProjectDataService()
    const authDataService = new AuthDataService()

    try {
      const clientAdditionalInfo = await userDataService.getClientAdditionalInfo(id)

      if (clientAdditionalInfo)
        await userDataService.deleteClientAdditionalInfo(clientAdditionalInfo.id)

      const projects = await projectDataService.getProjectsByClientId(id)
      await Promise.all(
        projects.docs.map(async (project) => {
          const semesterProjects = await projectDataService.getSemesterProjectsByProject(project.id)

          await Promise.all(
            semesterProjects.map((semesterProject) =>
              projectDataService.deleteSemesterProject(semesterProject.id),
            ),
          )

          await projectDataService.deleteProject(project.id)
        }),
      )

      const user = await userDataService.deleteUser(id)
      await authDataService.deleteAuthByEmail(user.email)

      return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: 'User not found' }, { status: StatusCodes.NOT_FOUND })
      } else {
        console.error(error)
        return NextResponse.json(
          { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }
  }
}

export const GET = RouteWrapper.GET,
  PATCH = RouteWrapper.PATCH,
  DELETE = RouteWrapper.DELETE
