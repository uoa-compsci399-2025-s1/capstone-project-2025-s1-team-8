import { CreateProjectData, CreateSemesterProjectData } from '@/types/Collections'
import { Project, SemesterProject } from '@/payload-types'
import { ProjectStatus } from '@/types/Project'
import { formResponseMock } from './Form.mock'
import { semesterMock } from '@/test-config/mocks/Semester.mock'
import { adminMock, clientMock } from './Auth.mock'

/*
 * Project mocks
 */

export const projectMock: Project = {
  id: '67ff38a56a35e1b6cf43a681',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  name: 'Project 1',
  description: 'Description 1',
  clients: [clientMock],
  formResponse: formResponseMock,
  deadline: new Date().toISOString(),
  timestamp: new Date().toISOString(),
}

export const projectMock2: Project = {
  id: '67ff38a56a35e1b6cf43a68c',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  name: 'Project 2',
  description: 'Description 2',
  clients: [clientMock],
  formResponse: '67ff38a56a35e1b6cf43a682',
  timestamp: new Date().toISOString(),
}

export const projectCreateMock: CreateProjectData = {
  name: 'Project 1',
  description: 'Description 1',
  clients: [clientMock],
  formResponse: '67ff38a56a35e1b6cf43a682',
  timestamp: new Date().toISOString(),
}

export const projectCreateMock2: CreateProjectData = {
  name: 'Project 2',
  description: 'Description 2',
  clients: [clientMock.id, adminMock.id],
  formResponse: '67ff38a56a35e1b6cf43a682',
  timestamp: new Date().toISOString(),
}

/*
 * SemesterProject mocks
 */

export const semesterProjectMock: SemesterProject = {
  id: '67ff38a56a35e1b6cf43a68b',
  number: 1,
  project: '67ff38a56a35e1b6cf43a68c',
  semester: '67ff38a56a35e1b6cf43a68d',
  status: ProjectStatus.Pending,
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const semesterProjectCreateMock: CreateSemesterProjectData = {
  number: 1,
  project: '67ff38a56a35e1b6cf43a68c',
  semester: semesterMock,
  status: ProjectStatus.Pending,
  published: false,
}

export const semesterProjectCreateMock2: CreateSemesterProjectData = {
  number: 2,
  project: projectMock,
  semester: semesterMock,
  status: ProjectStatus.Accepted,
  published: false,
}
