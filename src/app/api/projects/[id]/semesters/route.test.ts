import { cookies } from 'next/headers'
import { StatusCodes } from 'http-status-codes'

import { createMockNextRequest, paramsToPromise } from '@/test-config/utils'
import ProjectDataService from '@/data-layer/services/ProjectDataService'
import SemesterDataService from '@/data-layer/services/SemesterDataService'
import { adminToken, clientToken, studentToken } from '@/test-config/routes-setup'
import { AUTH_COOKIE_NAME } from '@/types/Auth'
import type { GetProjectSemestersResponse } from './route'
import { GET } from './route'
import { projectCreateMock, semesterProjectCreateMock } from '@/test-config/mocks/Project.mock'
import { semesterCreateMock } from '@/test-config/mocks/Semester.mock'
import { clientMock, studentMock } from '@/test-config/mocks/Auth.mock'

describe('/api/projects/[id]/semesters', async () => {
  const cookieStore = await cookies()
  const semesterDataService = new SemesterDataService()
  const projectDataService = new ProjectDataService()

  describe('GET', () => {
    it('should return a 401 if the requesting user is a student', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, studentToken)
      const res = await GET(createMockNextRequest(''), { params: paramsToPromise({ id: 'a' }) })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(((await res.json()) as GetProjectSemestersResponse).error).toBe('No scope')
    })

    it("should return a 401 if the requesting user isn't associated to the project", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
      })
      await projectDataService.createSemesterProject(semesterProjectCreateMock)

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(((await res.json()) as GetProjectSemestersResponse).error).toBe(
        'This project is not associated with the requesting client',
      )
    })

    it('should return a 200 if the client is an additional client', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, clientToken)
      const semester = await semesterDataService.createSemester(semesterCreateMock)
      const project = await projectDataService.createProject({
        ...projectCreateMock,
        client: studentMock,
        additionalClients: [clientMock],
      })
      await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        project,
        semester,
      })

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const json: GetProjectSemestersResponse = await res.json()
      expect(json.data).toStrictEqual([semester])
    })

    it('should return all the semesters that are releated to a project', async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock)
      const project = await projectDataService.createProject(projectCreateMock)
      await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        semester,
        project,
      })
      await projectDataService.createSemesterProject({
        ...semesterProjectCreateMock,
        semester: semester2,
        project,
      })

      const res = await GET(createMockNextRequest(''), {
        params: paramsToPromise({ id: project.id }),
      })

      const json: GetProjectSemestersResponse = await res.json()
      expect(json.data.length).toStrictEqual(2)
      expect(json.data).toStrictEqual(expect.arrayContaining([semester, semester2]))
    })
  })
})
