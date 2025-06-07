import { StatusCodes } from 'http-status-codes'
import { cookies } from 'next/headers'

import {
  createMockNextPatchRequest,
  createMockNextRequest,
  paramsToPromise,
} from '@/test-config/utils'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import { projectCreateMock, semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { GET, PATCH, DELETE, type UpdateProjectRequestBody } from '@/app/api/projects/[id]/route'
import { adminMock, clientMock, studentMock } from '@/test-config/mocks/Auth.mock'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { ProjectStatus } from '@/types/Project'
import type { Semester } from '@/payload-types'

describe('tests /api/projects/[id]', async () => {
  const projectDataService = new ProjectDataService()
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe('GET /api/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should return a 401 if the project isn't associated with the requesting client", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)

      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
      })

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should get a project correctly', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const project = await projectDataService.createProject(projectCreateMock)

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual({ data: project })
    })

    it('should return a 404 error if the project does not exist', async () => {
      const slug = { id: 'nonexistent' }
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })

  describe('PATCH /api/admin/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'poop' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should update a project correctly', async () => {
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        additionalClients: [adminMock],
      })
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const body = await res.json()
      expect(body.data.name).toEqual('Updated project')

      const res1 = await PATCH(
        createMockNextPatchRequest('', { name: 'Updated project 1', description: 'Hi hi' }),
        {
          params: paramsToPromise({ id: project.id }),
        },
      )
      expect(res1.status).toBe(StatusCodes.OK)
      const body1 = await res1.json()
      expect(body1.data.name).toEqual('Updated project 1')
      expect(body1.data.description).toEqual('Hi hi')
    })

    it('should delete and create semester projects according to the patched semesters', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const semester1 = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock)

      const project = await projectDataService.createProject(projectCreateMock)
      const semesterProject1 = await projectDataService.createSemesterProject({
        project,
        semester: semester1,
        status: ProjectStatus.Rejected,
      })

      const res = await PATCH(
        createMockNextPatchRequest('', {
          semesters: [semester2.id],
        } satisfies UpdateProjectRequestBody),
        {
          params: paramsToPromise({ id: project.id }),
        },
      )

      expect(res.status).toBe(StatusCodes.OK)
      await expect(projectDataService.getSemesterProject(semesterProject1.id)).rejects.toThrow(
        'Not Found',
      )
      const semesterProjects = await projectDataService.getSemesterProjectsByProject(project.id)
      expect(semesterProjects.length).toBe(1)
      expect((semesterProjects[0].semester as Semester).id).toBe(semester2.id)
    })

    it('should return a 404 error if the project does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: 'nonexistent' }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })

    it("should 401 if the project client doesn't match", async () => {
      const project = await projectDataService.createProject(projectCreateMock)
      const res = await PATCH(createMockNextPatchRequest('', { name: 'Updated project' }), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toEqual({ error: 'No token provided' })
    })
  })

  describe('DELETE /api/admin/projects/[id]', () => {
    it('should return a 401 if role is student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await DELETE(createMockNextRequest(''), {
        params: paramsToPromise({ id: 'hhhhh' }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should delete a project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: clientMock,
      })

      const res = await DELETE(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect((await projectDataService.getAllProjects()).docs.length).toEqual(0)
    })

    it('should delete a project and related semester projects', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: clientMock,
      })
      const semesterProject = await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        project,
      })

      const res = await DELETE(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect((await projectDataService.getAllProjects()).docs.length).toEqual(0)
      await expect(projectDataService.getSemesterProject(semesterProject.id)).rejects.toThrow(
        'Not Found',
      )
    })

    it('should return a 401 if the project is not related to the client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
      })

      const res = await DELETE(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should return a 404 error if the project does not exist', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const slug = { id: 'nonexistent' }
      const res = await DELETE(createMockNextRequest(''), {
        params: paramsToPromise(slug),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toEqual({ error: 'Project not found' })
    })
  })
})
