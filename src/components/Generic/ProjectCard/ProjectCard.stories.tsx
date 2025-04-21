import type { Meta, StoryObj } from '@storybook/react'
import ProjectCard from './ProjectCard'
import { ProjectDTOPlaceholder } from './DraggableProjectCard'

const meta: Meta<typeof ProjectCard> = {
  component: ProjectCard,
  title: 'Generic/SemesterProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProjectCard>

const mockProject: ProjectDTOPlaceholder = {
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
}

export const Default: Story = {
  args: {
    projectInfo: mockProject,
  },
}
