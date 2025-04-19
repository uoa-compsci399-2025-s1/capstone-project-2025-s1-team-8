import React from 'react'
import { Meta, Story } from '@storybook/react'
import SemesterCard, { SemesterCardProps } from './SemesterCard'
import { ProjectDTOPlaceholder } from '@/components/Generic/ProjectCard/ProjectCard'

const mockProjects: ProjectDTOPlaceholder[] = [
  {
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
  {
    projectId: 'p2',
    projectName: 'Capstone Submission',
    projectDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    client: {
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
    },
    additionalClients: [],
    desiredOutput: 'Functional prototype and documentation',
    teamNumber: 2,
    semesters: ['Semester 2 2025'],
    submissionDate: new Date('2025-03-20'),
  },
]

const mockProps: SemesterCardProps = {
  semesterName: 'Semester 2 2025',
  startDate: new Date('2025-07-01'),
  endDate: new Date('2025-12-15'),
  submissionDeadline: new Date('2025-01-30'),
  approvedProjects: mockProjects,
}

export default {
  title: 'Composite/SemesterCard',
  component: SemesterCard,
  args: mockProps,
} as Meta

export const Default: Story = {}

export const CurrentSemester: Story = {
  args: {
    ...Default.args,
    semesterName: 'Current Semester',
    currentOrUpcoming: 'current',
  },
}

export const UpcomingSemester: Story = {
  args: {
    ...Default.args,
    semesterName: 'Upcoming Semester',
    currentOrUpcoming: 'upcoming',
  },
}
