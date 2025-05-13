import type { Meta, StoryObj } from '@storybook/react'
import ClientCard from './ClientCard'
import { mockClients } from '@/test-config/mocks/User.mock'
import { projectsWithSemestersMock } from '@/test-config/mocks/Project.mock'

const meta: Meta<typeof ClientCard> = {
  component: ClientCard,
  title: 'Generic/ClientCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientCard>

export const Default: Story = {
  args: {
    clientInfo: mockClients[0],
    projects: projectsWithSemestersMock,
  },
}
