import { CreateProjectData, CreateSemesterProjectData } from '@/types/Collections'
import { Project, SemesterProject } from '@/payload-types'
import { ProjectStatus } from '@/types/Project'
import { semesterMock, mockSemesters } from '@/test-config/mocks/Semester.mock'
import { clientMock } from './Auth.mock'
import { ProjectDetails } from '@/types/Project'

/*
 * Project mocks
 */

export const projectMock: Project = {
  id: '67ff38a56a35e1b6cf43a681',
  name: 'Project 1',
  description: 'Description 1',
  client: clientMock,
  deadline: new Date().toISOString(),
  timestamp: new Date().toISOString(),
  desiredOutput: 'cool project',
  specialEquipmentRequirements: 'computer',
  numberOfTeams: '5',
  availableResources: 'nothing',
  futureConsideration: false,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const projectMock2: Project = {
  id: '67ff38a56a35e1b6cf43a68c',
  name: 'Project 2',
  description: 'Description 2',
  client: clientMock,
  deadline: new Date().toISOString(),
  timestamp: new Date().toISOString(),
  desiredOutput: 'cool project',
  specialEquipmentRequirements: 'computer',
  numberOfTeams: '5',
  availableResources: 'nothing',
  futureConsideration: false,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const projectCreateMock: CreateProjectData = {
  name: 'Project Create Mock',
  description: 'Description 2',
  client: clientMock,
  deadline: new Date().toISOString(),
  timestamp: new Date().toISOString(),
  desiredOutput: 'cool project',
  specialEquipmentRequirements: 'computer',
  numberOfTeams: '5',
  availableResources: 'nothing',
  futureConsideration: false,
}

export const projectCreateMock2: CreateProjectData = {
  name: 'Project Create Mock 2',
  description: 'Description 2',
  client: clientMock,
  deadline: new Date().toISOString(),
  timestamp: new Date().toISOString(),
  desiredOutput: 'cool project',
  specialEquipmentRequirements: 'computer',
  numberOfTeams: '5',
  availableResources: 'nothing',
  futureConsideration: false,
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
  status: ProjectStatus.Approved,
  published: false,
}

/*
 * ProjectDetails mocks
 */
export const ProjectDetailsMock: ProjectDetails = {
  ...projectMock,
  semesters: [semesterMock],
}

export const ProjectDetailsMock2: ProjectDetails = {
  ...projectMock2,
  semesters: [mockSemesters[0], mockSemesters[1]],
}

export const ProjectDetailsMock3: ProjectDetails = {
  ...projectMock,
  semesters: mockSemesters,
}

export const projectDetailsListMock: ProjectDetails[] = [
  ProjectDetailsMock,
  ProjectDetailsMock2,
  ProjectDetailsMock3,
]
