import type { Meta, StoryObj } from '@storybook/react'
import DraggableProjectCard from './DraggableProjectCard'
import { ProjectCardType } from './DraggableProjectCard'

const meta: Meta<typeof DraggableProjectCard> = {
  component: DraggableProjectCard,
  title: 'Generic/DraggableProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DraggableProjectCard>

const mockProject: ProjectCardType = {
  id: 'project-1',
  projectInfo: {
    projectId: 'p1',
    projectName: 'Chronobiology',
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    client: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    },
    additionalClients: [],
    desiredOutput: 'Functional prototype and documentation',
    teamNumber: 2,
    semesters: ['Semester 2 2025'],
    submissionDate: new Date('2025-06-30'),
  },
}

export const Default: Story = {
  args: {
    ...mockProject,
  },
}
