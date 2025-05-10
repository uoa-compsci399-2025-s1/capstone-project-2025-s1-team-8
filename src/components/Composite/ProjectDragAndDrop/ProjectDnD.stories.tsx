import { Meta, StoryObj } from '@storybook/react'
import ProjectDnD from './ProjectDnD'
import { UniqueIdentifier } from '@dnd-kit/core'
import { mockProjects } from '@/mocks/Projects.mock'
import { ProjectStatus } from '@/types/Project'

const semesterId = 'semester12026'
const presetContainers = [
  {
    id: 'rejected-container' as UniqueIdentifier,
    title: ProjectStatus.Rejected,
    containerColor: 'light' as const,
    currentItems: [
      { id: 'item-1', projectInfo: mockProjects[0] },
      { id: 'item-2', projectInfo: mockProjects[1] },
    ],
    originalItems: [
      { id: 'item-1', projectInfo: mockProjects[0] },
      { id: 'item-2', projectInfo: mockProjects[1] },
    ],
  },
  {
    id: 'pending-container' as UniqueIdentifier,
    title: ProjectStatus.Pending,
    containerColor: 'medium' as const,
    currentItems: [],
    originalItems: [],
  },
  {
    id: 'approved-container' as UniqueIdentifier,
    title: ProjectStatus.Approved,
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
    presetContainers: presetContainers,
    semesterId: semesterId,
  },
}

export default meta

type Story = StoryObj<typeof ProjectDnD>

export const Default: Story = {}
