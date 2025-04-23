import type { Meta, StoryObj } from '@storybook/react'
import ProjectCard from './ProjectCard'
import { mockProjects1 } from '@/mocks/Projects.mock'

const meta: Meta<typeof ProjectCard> = {
  component: ProjectCard,
  title: 'Generic/ProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProjectCard>

export const Default: Story = {
  args: {
    projectInfo: mockProjects1[0],
  },
}
