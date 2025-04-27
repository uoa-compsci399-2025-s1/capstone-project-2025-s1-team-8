import { Meta, StoryObj } from '@storybook/react'
import SemesterCard, { SemesterDTOPlaceholder } from './SemesterCard'
import { mockProjects1 } from '@/mocks/Projects.mock'
import { mockSemesters } from '@/mocks/Semesters.mock'

const mockProps: SemesterDTOPlaceholder = mockSemesters[0]

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
