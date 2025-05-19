import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { GET } from './route'
import { createMockNextRequest } from '@/test-config/utils'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { adminMock, clientMock } from '@/test-config/mocks/Auth.mock'
import ProjectService from '@/data-layer/services/ProjectService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'

describe('tests /api/users/me/projects', async () => {
  const projectService = new ProjectService()
  const cookieStore = await cookies()

  vi.mock('@/data-layer/services/ProjectService', async () => {
    const actualModule = await vi.importActual('@/data-layer/services/ProjectService')
    // eslint-disable-next-line
    const actualProjectService = (actualModule as any).default // Access the default export

    return {
      default: class extends actualProjectService {
        getProjectsByClientId = vi.fn().mockImplementation((userID) => {
          if (userID === adminMock.id) {
            return { docs: [projectCreateMock] }
          } else if (userID === clientMock.id) {
            return { docs: [] }
          }
        })
      },
    }
  })

  describe('GET /api/users/me/projects', () => {
    it('should return a 401 if no user is authenticated', async () => {
      const res = await GET(createMockNextRequest('/api/users/me/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No token provided')
    })

    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('/api/users/me/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await res.json()).error).toBe('No scope')
    })

    it("should return user's project data", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      await projectService.createProject(projectCreateMock)
      const res = await GET(createMockNextRequest('/api/users/me/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.length).toEqual(1)
    })

    it('should not return projects not related to the user', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await projectService.createProject(projectCreateMock)
      const res = await GET(createMockNextRequest('/api/users/me/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })
  })
})
