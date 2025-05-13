import type { Meta, StoryObj } from '@storybook/react'
import ClientGroup from './ClientGroup'
import { mockClients } from '@/test-config/mocks/User.mock'

const meta: Meta<typeof ClientGroup> = {
  component: ClientGroup,
  title: 'Composite/ClientGroup',
  tags: ['autodocs'],
}

export default meta

const mockClientsWithProjects = mockClients.map((c) => ({
  client: c,
  projects: [],
}))

type Story = StoryObj<typeof ClientGroup>

export const Default: Story = {
  args: {
    clients: mockClientsWithProjects,
  },
}
