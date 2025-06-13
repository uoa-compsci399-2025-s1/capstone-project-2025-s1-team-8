import { ProjectDetailsMock3, ProjectDetailsMock4 } from '@/test-config/mocks/Project.mock'
import { sortProjects } from './AdminUtil'
import { UniqueIdentifier } from '@dnd-kit/core'
import { ProjectStatus } from '@/types/Project'
import { User } from '@/payload-types'

describe('sortProjects', () => {
  const presetContainers = [
    {
      id: 'rejected-container' as UniqueIdentifier,
      title: ProjectStatus.Rejected,
      containerColor: 'light' as const,
      currentItems: [
        { id: 'item-1', projectInfo: ProjectDetailsMock4 },
        { id: 'item-2', projectInfo: ProjectDetailsMock3 },
      ],
      originalItems: [
        { id: 'item-1', projectInfo: ProjectDetailsMock3 },
        { id: 'item-2', projectInfo: ProjectDetailsMock4 },
      ],
    },
    {
      id: 'pending-container' as UniqueIdentifier,
      title: ProjectStatus.Pending,
      containerColor: 'medium' as const,
      currentItems: [
        { id: 'item-1', projectInfo: ProjectDetailsMock4 },
        { id: 'item-2', projectInfo: ProjectDetailsMock3 },
      ],
      originalItems: [
        { id: 'item-1', projectInfo: ProjectDetailsMock3 },
        { id: 'item-2', projectInfo: ProjectDetailsMock4 },
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
