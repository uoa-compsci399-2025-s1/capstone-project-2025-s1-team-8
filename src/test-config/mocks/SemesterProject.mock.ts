import { SemesterProject } from '@/payload-types'
import { CreateSemesterProjectData } from '@/types/Collections'
import { ProjectStatus } from '@/types/project'

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
