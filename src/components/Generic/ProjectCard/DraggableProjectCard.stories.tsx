import type { Meta, StoryObj } from '@storybook/react'
import DraggableProjectCard from './DraggableProjectCard'
import { ProjectCardType } from './DraggableProjectCard'
import { mockProjects } from '@/mocks/Projects.mock'

const meta: Meta<typeof DraggableProjectCard> = {
  component: DraggableProjectCard,
  title: 'Generic/DraggableProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DraggableProjectCard>

const project: ProjectCardType = {
  id: 'project-1',
  projectInfo: mockProjects[0],
}

export const Default: Story = {
  args: {
    ...project,
  },
}
