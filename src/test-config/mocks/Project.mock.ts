import { CreateProjectData, CreateSemesterProjectData } from '@/types/Collections'
import { mockClient1, mockClient2 } from './User.mock'
import { Project, SemesterProject } from '@/payload-types'
import { ProjectStatus } from '@/types/Project'
import { formResponseMock } from './Form.mock'
import { semesterMock } from './Semester.mock'

/*
 * Project mocks
 */

export const projectMock: Project = {
  id: '67ff38a56a35e1b6cf43a681',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  name: 'Project 1',
  description: 'Description 1',
  clients: [mockClient1],
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
  clients: [mockClient1, mockClient2],
  formResponse: '67ff38a56a35e1b6cf43a682',
  timestamp: new Date().toISOString(),
}

export const projectCreateMock: CreateProjectData = {
  name: 'Project 1',
  description: 'Description 1',
  clients: [mockClient1],
  formResponse: '67ff38a56a35e1b6cf43a682',
  timestamp: new Date().toISOString(),
}

export const projectCreateMock2: CreateProjectData = {
  name: 'Project 2',
  description: 'Description 2',
  clients: [mockClient1.id, mockClient2.id],
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
  semester: '67ff38a56a35e1b6cf43a68d',
  status: ProjectStatus.Pending,
  published: false,
}

export const semesterProjectMock2: SemesterProject = {
  id: '67ff38a56a35e1b6cf43a68e',
  number: 2,
  project: '67ff38a56a35e1b6cf43a68f',
  semester: '67ff38a56a35e1b6cf43a68g',
  status: ProjectStatus.Accepted,
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
export const semesterProjectMock3: SemesterProject = {
  id: '67ff38a56a35e1b6cf43a68h',
  number: 3,
  project: '67ff38a56a35e1b6cf43a68i',
  semester: '67ff38a56a35e1b6cf43a68j',
  status: ProjectStatus.Rejected,
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
export const semesterProjectMock4: SemesterProject = {
  id: '67ff38a56a35e1b6cf43a68k',
  number: 4,
  project: '67ff38a56a35e1b6cf43a68l',
  semester: '67ff38a56a35e1b6cf43a68m',
  status: ProjectStatus.Pending,
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
export const semesterProjectCreateMock2: CreateSemesterProjectData = {
  number: 2,
  project: projectMock,
  semester: semesterMock,
  status: ProjectStatus.Accepted,
  published: false,
}

export const semesterProjectListMock: SemesterProject[] = [
  semesterProjectMock,
  semesterProjectMock2,
  semesterProjectMock3,
  semesterProjectMock4,
]
