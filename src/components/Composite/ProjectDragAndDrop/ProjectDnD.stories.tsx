import { Meta, StoryObj } from '@storybook/react'
import ProjectDnD from './ProjectDnD'
import { UniqueIdentifier } from '@dnd-kit/core'

const containers = [
  {
    id: 'container-1' as UniqueIdentifier,
    title: 'Rejected',
    containerColor: 'light' as const,
    items: [
      {
        id: `item-1`,
        projectInfo: {
          projectId: 'P1',
          projectName: `Project Alpha`,
          projectDescription: 'First test project',
          client: {
            name: 'Alice Smith',
            email: 'alice@example.com',
          },
          desiredOutput: 'Web app',
          teamNumber: 1,
          semesters: ['S1 2025'],
          submissionDate: new Date('2025-06-01'),
        },
      },
      {
        id: `item-2`,
        projectInfo: {
          projectId: 'P2',
          projectName: `Project Beta`,
          projectDescription: 'Second test project',
          client: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
          },
          desiredOutput: 'Mobile app',
          teamNumber: 2,
          semesters: ['S2 2025'],
          submissionDate: new Date('2025-08-15'),
        },
      },
    ],
  },
  {
    id: 'container-2' as UniqueIdentifier,
    title: 'Pending',
    containerColor: 'medium' as const,
    items: [],
  },
  {
    id: 'container-3' as UniqueIdentifier,
    title: 'Accepted',
    containerColor: 'dark' as const,
    items: [],
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
