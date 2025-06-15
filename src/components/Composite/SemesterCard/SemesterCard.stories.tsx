import type { Meta, StoryObj } from '@storybook/react'
import SemesterCard from './SemesterCard'
import { semesterMock } from '@/test-config/mocks/Semester.mock'
import { UseQueryResult } from '@tanstack/react-query'
import { ProjectDetails } from '@/types/Project'
import { QueryClientDecorator } from '@/utils/storybookProvider'

export default {
  title: 'Composite/SemesterCard',
  component: SemesterCard,
  args: {
    semester: semesterMock,
    useSemesterProjects: (id: string) => {
      console.log(`Fetching projects for semester ${id}`)
      return { data: [], isLoading: false } as unknown as UseQueryResult<ProjectDetails[], Error>
    },
  },
  decorators: [QueryClientDecorator],
} as Meta

type Story = StoryObj<typeof SemesterCard>

export const Default: Story = {}

export const CurrentSemester: Story = {
  args: {
    ...Default.args,
    semester: semesterMock,
  },
}

export const UpcomingSemester: Story = {
  args: {
    ...Default.args,
    semester: semesterMock,
    currentOrUpcoming: 'upcoming',
  },
}
