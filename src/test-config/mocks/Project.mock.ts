import { CreateProjectData } from '@/types/CreateProjectData'
import { mockClient1, mockClient2 } from './User.mock'
import { Project } from '@/payload-types'

export const mockProject1: Project = {
  id: '67ff38a56a35e1b6cf43a681',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  name: 'Project 1',
  description: 'Description 1',
  clients: [mockClient1],
  timestamp: new Date().toISOString(),
}

export const mockProject2: Project = {
  id: '67ff38a56a35e1b6cf43a68c',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  name: 'Project 2',
  description: 'Description 2',
  clients: [mockClient1, mockClient2],
  timestamp: new Date().toISOString(),
}

export const mockProject3: CreateProjectData = {
  name: 'Project 1',
  description: 'Description 1',
  clients: [mockClient1],
  timestamp: new Date().toISOString(),
}

export const mockProject4: CreateProjectData = {
  name: 'Project 2',
  description: 'Description 2',
  clients: [mockClient1, mockClient2],
  timestamp: new Date().toISOString(),
}
