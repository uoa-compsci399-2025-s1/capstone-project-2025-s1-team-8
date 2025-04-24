import type { Meta, StoryObj } from '@storybook/react'
import CreateProjectCard from './CreateProjectCard'

const meta: Meta<typeof CreateProjectCard> = {
  component: CreateProjectCard,
  title: 'Composite/CreateProjectCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof CreateProjectCard>

export const Default: Story = {
  args: {},
}
