import { Security } from '@/business-layer/middleware/Security'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import type { UserCombinedInfo } from '@/types/Collections'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

class RouteWrapper {
  /**
   * Method to handle GET requests for a user's own projects.
   *
   * @param req The next request object containing the user information
   * @returns The response object containing the user's projects
   */
  @Security('jwt', ['client', 'admin'])
  static async GET(req: NextRequest & { user: UserCombinedInfo }) {
    const { user } = req
    const userID = user.id
    const projectDataService = new ProjectDataService()
    const projects = await projectDataService.getProjectsByClientId(userID)
    return NextResponse.json({ data: projects.docs })
  }
}

export const GET = RouteWrapper.GET
