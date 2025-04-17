import { SemesterProject } from '@/payload-types'
import { CreateSemesterProjectData } from '@/types/Collections'
import { ProjectStatus } from '@/types/Project'

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

export const semesterProjectListMock: SemesterProject[] = [
  semesterProjectMock,
  semesterProjectMock2,
  semesterProjectMock3,
  semesterProjectMock4,
]
