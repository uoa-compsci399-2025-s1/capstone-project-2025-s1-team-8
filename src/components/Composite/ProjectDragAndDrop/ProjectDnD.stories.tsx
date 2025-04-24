import { Meta, StoryObj } from '@storybook/react'
import ProjectDnD from './ProjectDnD'
import { UniqueIdentifier } from '@dnd-kit/core'
import { mockProjects1 } from '@/mocks/Projects.mock'

const containers = [
  {
    id: 'container-1' as UniqueIdentifier,
    title: 'Rejected',
    containerColor: 'light' as const,
    currentItems: [
      {
        id: `item-1`,
        projectInfo: mockProjects1[0],
      },
      {
        id: `item-2`,
        projectInfo: mockProjects1[1],
      },
    ],
    originalItems: [],
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
