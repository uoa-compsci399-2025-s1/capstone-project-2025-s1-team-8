import type { Meta, StoryObj } from '@storybook/react'
import DraggableProjectCard from './DraggableProjectCard'
import type { ProjectCardType } from './DraggableProjectCard'
import { projectMock } from '@/test-config/mocks/Project.mock'

const meta: Meta<typeof DraggableProjectCard> = {
  component: DraggableProjectCard,
  title: 'Generic/DraggableProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DraggableProjectCard>

const project: ProjectCardType = {
  id: 'project-1',
  projectInfo: projectMock,
}

export const Default: Story = {
  args: {
    ...project,
  },
}
