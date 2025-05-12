import type { Meta, StoryObj } from '@storybook/react'
import ProjectCardList from './ProjectCardList'
import { mockProjects } from '@/mocks/projects.mock'
import { mockSemestersNested } from '@/mocks/newSemesters.mock'

const meta: Meta<typeof ProjectCardList> = {
  title: 'Composite/ProjectCardList',
  component: ProjectCardList,
  tags: ['autodocs'],
  args: {
    className: '',
    headingClassName: '',
    projects: mockProjects,
  },
}

export default meta
type Story = StoryObj<typeof ProjectCardList>

export const AsCard: Story = {
  args: {
    className: 'bg-muted-blue-op-45 px-15 pt-8 pb-12 rounded-2xl border-deeper-blue border',
    headingClassName: 'text-xl sm:text-2xl py-4 sm:py-6',
    heading: 'My projects',
    projects: mockProjects,
    semesters: mockSemestersNested,
  },
}

export const InModal: Story = {
  args: {
    className:
      'bg-transparent-blue border-t-deeper-blue border-t max-w-full flex flex-col p-15 rounded-b-2xl gap-5',
    headingClassName: 'text-3xl pb-3 tracking-wide',
    heading: 'Projects',
    projects: mockProjects,
    semesters: mockSemestersNested,
  },
}

export const InCard: Story = {
  args: {
    className: 'bg-muted-blue-op-45 pb-4 sm:pb-6',
    headingClassName: 'text-xl sm:text-2xl py-4 sm:py-6',
    heading: 'Approved projects',
    projects: mockProjects,
    semesters: mockSemestersNested,
  },
}
