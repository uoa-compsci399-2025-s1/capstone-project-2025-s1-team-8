import { Meta, StoryObj } from '@storybook/react'
import SemesterCard, { SemesterCardProps } from './SemesterCard'
import { mockProjects } from '@/mocks/Projects.mock'

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

type Story = StoryObj<typeof SemesterCard>

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
