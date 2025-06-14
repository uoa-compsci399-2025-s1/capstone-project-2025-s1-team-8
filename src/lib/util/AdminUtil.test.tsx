import {
  ProjectDetailsMock,
  ProjectDetailsMock2,
  semesterProjectMock,
} from '@/test-config/mocks/Project.mock'
import { sortByProjectNumber, sortProjects } from './AdminUtil'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { ProjectDetails, ProjectStatus } from '@/types/Project'
import type { SemesterProject, User } from '@/payload-types'
import { clientMock2 } from '@/test-config/mocks/Auth.mock'

const date = new Date()
const laterDate = new Date(date.getTime() + 24 * 60 * 60 * 1000) // +1 day

const Project1: ProjectDetails = {
  ...ProjectDetailsMock,
  createdAt: date.toISOString(),
}

const Project2: ProjectDetails = {
  ...ProjectDetailsMock2,
  client: clientMock2,
  createdAt: laterDate.toISOString(),
}

describe('sortProjects', () => {
  const presetContainers = [
    {
      id: 'rejected-container' as UniqueIdentifier,
      title: ProjectStatus.Rejected,
      containerColor: 'light' as const,
      currentItems: [
        { id: 'item-1', projectInfo: Project2 },
        { id: 'item-2', projectInfo: Project1 },
      ],
      originalItems: [
        { id: 'item-1', projectInfo: Project1 },
        { id: 'item-2', projectInfo: Project2 },
      ],
    },
    {
      id: 'pending-container' as UniqueIdentifier,
      title: ProjectStatus.Pending,
      containerColor: 'medium' as const,
      currentItems: [
        { id: 'item-1', projectInfo: Project2 },
        { id: 'item-2', projectInfo: Project1 },
      ],
      originalItems: [
        { id: 'item-1', projectInfo: Project1 },
        { id: 'item-2', projectInfo: Project2 },
      ],
    },
  ]

  it('sorts by projectName', () => {
    const result = sortProjects(presetContainers, 'rejected-container', 'projectName')
    const sortedNames = result[0].currentItems.map((item) => item.projectInfo.name)
    expect(sortedNames).toEqual(['Project 1', 'Project 2'])

    const nonSortedContainerNames = result[1].currentItems.map((item) => item.projectInfo.name)
    expect(nonSortedContainerNames).toEqual(['Project 2', 'Project 1'])
  })

  it('sorts by clientName', () => {
    const result = sortProjects(presetContainers, 'rejected-container', 'clientName')
    const sortedClients = result[0].currentItems.map((item) => {
      const user = item.projectInfo.client as User
      return user.firstName + ' ' + user.lastName
    })
    expect(sortedClients).toEqual(['Client 1', 'Client 2'])

    const nonSortedContainerClients = result[1].currentItems.map((item) => {
      const user = item.projectInfo.client as User
      return user.firstName + ' ' + user.lastName
    })
    expect(nonSortedContainerClients).toEqual(['Client 2', 'Client 1'])
  })

  it('sorts by submissionDate', () => {
    const result = sortProjects(presetContainers, 'rejected-container', 'submissionDate')
    const sortedNames = result[0].currentItems.map((item) => item.projectInfo.name)
    expect(sortedNames).toEqual(['Project 1', 'Project 2'])

    const nonSortedContainerNames = result[1].currentItems.map((item) => item.projectInfo.name)
    expect(nonSortedContainerNames).toEqual(['Project 2', 'Project 1'])
  })

  it('resets to originalOrder', () => {
    const result = sortProjects(presetContainers, 'rejected-container', 'originalOrder')
    const sortedNames = result[0].currentItems.map((item) => item.projectInfo.name)
    expect(sortedNames).toEqual(['Project 1', 'Project 2'])

    const nonSortedContainerNames = result[1].currentItems.map((item) => item.projectInfo.name)
    expect(nonSortedContainerNames).toEqual(['Project 2', 'Project 1'])
  })

  it('does nothing when containerId does not match', () => {
    const result = sortProjects(presetContainers, 'nonexistent-id', 'projectName')
    expect(result).toEqual(presetContainers)
  })
})

describe('sortByProjectNumber', () => {
  it('sorts projects in descending order by number', () => {
    const projects: SemesterProject[] = [
      { ...semesterProjectMock, number: 1 },
      { ...semesterProjectMock, number: 2 },
      { ...semesterProjectMock, number: 3 },
    ]

    const sorted = sortByProjectNumber(projects)

    expect(sorted.map((p) => p.number)).toEqual([3, 2, 1])
  })

  it('handles null numbers by placing them last', () => {
    const projects: SemesterProject[] = [
      { ...semesterProjectMock, number: null },
      { ...semesterProjectMock, number: 2 },
      { ...semesterProjectMock, number: 1 },
    ]

    const sorted = sortByProjectNumber(projects)

    expect(sorted.map((p) => p.number)).toEqual([2, 1, null])
  })

  it('handles all null numbers', () => {
    const projects: SemesterProject[] = [
      { ...semesterProjectMock, number: null },
      { ...semesterProjectMock, number: null },
    ]

    const sorted = sortByProjectNumber(projects)

    expect(sorted.map((p) => p.number)).toEqual([null, null])
  })

  it('handles empty array', () => {
    const sorted = sortByProjectNumber([])

    expect(sorted).toEqual([])
  })
})
