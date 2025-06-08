import type { Meta, StoryObj } from '@storybook/react'
import SemesterCard from './SemesterCard'
import { mockSemesters } from '@/test-config/mocks/Semester.mock'
import type { Semester } from '@/payload-types'

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
    semester: mockSemesters[1],
  },
}

export const UpcomingSemester: Story = {
  args: {
    ...Default.args,
    semester: mockSemesters[1],
    currentOrUpcoming: 'upcoming',
  },
}
