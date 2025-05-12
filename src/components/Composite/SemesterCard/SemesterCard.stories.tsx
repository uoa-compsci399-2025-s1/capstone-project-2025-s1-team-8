import { Meta, StoryObj } from '@storybook/react'
import SemesterCard from './SemesterCard'
import { mockSemesters } from '@/mocks/newSemesters.mock'
import { Semester } from '@/payload-types'

const mockProps: Semester = mockSemesters[0]

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
    name: 'Current Semester',
    //currentOrUpcoming: 'current',
  },
}

export const UpcomingSemester: Story = {
  args: {
    ...Default.args,
    name: 'Upcoming Semester',
    //currentOrUpcoming: 'upcoming',
  },
}
