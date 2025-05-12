import type { Meta, StoryObj } from '@storybook/react'
import ClientCard from './ClientCard'
import { clientMocks as mockClients } from '@/mocks/clients.mock'
import { mockProjects } from '@/mocks/projects.mock'

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
    projects: mockProjects,
  },
}
