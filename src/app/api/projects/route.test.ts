import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import { createMockNextPostRequest, createMockNextRequest } from '@/test-config/utils'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { projectCreateMock } from '@/test-config/mocks/Project.mock'
import type { CreateProjectRequestBody, CreateProjectResponse } from './route'
import { GET, POST } from './route'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { clientMock, studentMock } from '@/test-config/mocks/Auth.mock'
import UserDataService from '@/data-layer/services/UserDataService'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import type { Project } from '@/payload-types'

describe('test /api/projects', async () => {
  const projectDataService = new ProjectDataService()
  const userDataService = new UserDataService()
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe('GET /api/projects', () => {
    it('should return a 401 if user is not authenticated', async () => {
      const res = await GET(createMockNextRequest('api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest('api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })
    })

    it('should get no projects if none are created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const res = await GET(createMockNextRequest('api/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toEqual([])
    })

    it('should return a list of all projects created', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await projectDataService.createProject(projectCreateMock)
      await projectDataService.createProject(projectCreateMock)
      const res = await GET(createMockNextRequest('api/projects'))
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(2)
    })

    it('should return bad Request if limit is more than 100 or less than 1', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest('api/projects?limit=101'))
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const res2 = await GET(createMockNextRequest('api/projects?limit=0'))
      expect(res2.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return a list of all projects created with pagination', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      await projectDataService.createProject(projectCreateMock)
      await projectDataService.createProject(projectCreateMock)
      await projectDataService.createProject(projectCreateMock)
      const res1 = await GET(createMockNextRequest('api/projects?page=2&limit=2'))
      expect(res1.status).toBe(StatusCodes.OK)
      const data1 = await res1.json()
      expect(data1.data.length).toEqual(1)
      expect(data1.nextPage).toBeNull()

      const res = await GET(createMockNextRequest('api/projects?page=1&limit=1'))
      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data.length).toEqual(1)
      expect(data.nextPage).not.toBeNull()
    })

    it('should only return projects related to the client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const relatedProject = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
        additionalClients: [clientMock],
      })
      await projectDataService.createProject({ ...projectCreateMock, client: studentMock })

      const res = await GET(createMockNextRequest('api/projects'))

      const json = await res.json()
      expect(json.data).toStrictEqual([relatedProject])
    })
  })

  describe('POST /api/projects', () => {
    it('should return a 401 if user is not authenticated', async () => {
      const res = await POST(createMockNextRequest('/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })

    it('should return a 401 if the user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await POST(createMockNextRequest('/api/projects'))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No scope' })
    })

    it('should create a project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const semester = await semesterDataService.createSemester(semesterCreateMock)
      const payload: CreateProjectRequestBody = {
        ...projectCreateMock,
        additionalClients: undefined,
        attachments: undefined,
        deadline: new Date().toISOString(),
        desiredTeamSkills: '',
        availableResources: '',
        semesters: [semester.id],
      }
      const res = await POST(createMockNextPostRequest('', payload))
      const project = (await res.json()).data

      expect(res.status).toBe(StatusCodes.CREATED)
      const fetchedProject = await projectDataService.getProjectById(project.id)
      expect(project).toEqual(fetchedProject)
      expect(fetchedProject.client).toStrictEqual(clientMock)

      // Project with client ID's instead of client objects
      const payload2: CreateProjectRequestBody = {
        ...projectCreateMock,
        additionalClients: [
          {
            firstName: clientMock.firstName,
            lastName: clientMock.lastName || undefined,
            email: clientMock.email,
          },
        ],
        attachments: undefined,
        deadline: new Date().toISOString(),
        desiredTeamSkills: '',
        availableResources: '',
        semesters: [semester.id],
      }
      const req2 = createMockNextPostRequest('api/projects', payload2)
      const res2 = await POST(req2)
      expect(res2.status).toBe(StatusCodes.CREATED)
      const project2 = await res2.json()
      expect(project2.data).toEqual(await projectDataService.getProjectById(project2.data.id))
    })

    it('should create a new client if the additional clients are non-existent', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)

      const additionalClientMock = {
        firstName: 'test',
        lastName: 'lastname',
        email: 'nonexistent@gmail.com',
      }
      await expect(userDataService.getUserByEmail(additionalClientMock.email)).rejects.toThrow(
        'Not Found',
      )

      const res = await POST(
        createMockNextPostRequest('', {
          ...projectCreateMock,
          semesters: [],
          additionalClients: [additionalClientMock],
        }),
      )
      const json: CreateProjectResponse = await res.json()
      expect(res.status).toBe(StatusCodes.CREATED)
      expect([await userDataService.getUserByEmail(additionalClientMock.email)]).toStrictEqual(
        json.data?.additionalClients,
      )
    })

    it('should create corresponding semester projects on project creation', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)

      const semester1 = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock)

      const res = await POST(
        createMockNextPostRequest('', {
          ...projectCreateMock,
          semesters: [semester1.id, semester2.id],
        }),
      )
      expect(res.status).toBe(StatusCodes.CREATED)

      const json: CreateProjectResponse = await res.json()
      const projectsInSemester1 = await projectDataService.getAllSemesterProjectsBySemester(
        semester1.id,
      )
      expect(
        projectsInSemester1.docs.some(
          (project) => (project.project as Project).id === json.data?.id,
        ),
      ).toBeTruthy()

      const projectsInSemester2 = await projectDataService.getAllSemesterProjectsBySemester(
        semester2.id,
      )
      expect(
        projectsInSemester2.docs.some(
          (project) => (project.project as Project).id === json.data?.id,
        ),
      ).toBeTruthy()
    })

    it('should return a 400 if the body is malformed', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextPostRequest('', {
        ...projectCreateMock,
        description: undefined,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it('should return a 400 if the semesters are non-existent', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextPostRequest('', {
          ...projectCreateMock,
          semesters: ['wow'],
        }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(((await res.json()) as CreateProjectResponse).error).toBe(
        'Invalid request body, one or more semesters are invalid',
      )
    })
  })
})
