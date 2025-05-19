import { Meta, StoryObj } from '@storybook/react'
import ProjectDnD from './ProjectDnD'
import { UniqueIdentifier } from '@dnd-kit/core'
import { projectMock, projectMock2 } from '@/test-config/mocks/Project.mock'

const containers = [
  {
    id: 'container-1' as UniqueIdentifier,
    title: 'Rejected',
    containerColor: 'light' as const,
    currentItems: [
      {
        id: `item-1`,
        projectInfo: projectMock,
      },
      {
        id: `item-2`,
        projectInfo: projectMock2,
      },
    ],
    originalItems: [
      {
        id: `item-1`,
        projectInfo: projectMock,
      },
      {
        id: `item-2`,
        projectInfo: projectMock2,
      },
    ],
  },
  {
    id: 'container-2' as UniqueIdentifier,
    title: 'Pending',
    containerColor: 'medium' as const,
    currentItems: [],
    originalItems: [],
  },
  {
    id: 'container-3' as UniqueIdentifier,
    title: 'Accepted',
    containerColor: 'dark' as const,
    currentItems: [],
    originalItems: [],
  },
]

const meta: Meta<typeof ProjectDnD> = {
  title: 'Composite/ProjectDnD',
  component: ProjectDnD,
  tags: ['autodocs'],
  args: {
    presetContainers: containers,
  },
}

export default meta

type Story = StoryObj<typeof ProjectDnD>

export const Default: Story = {}
