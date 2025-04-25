import type { Meta, StoryObj } from '@storybook/react'
import ClientDashboard from './ClientDashboard'
import { mockClients } from '@/mocks/Clients.mock'
import { mockProjects1 } from '@/mocks/Projects.mock'

const meta: Meta<typeof ClientDashboard> = {
  title: 'Pages/ClientDashboard',
  component: ClientDashboard,
  tags: ['autodocs'],
  args: {
    client: mockClients[0],
    projects: mockProjects1,
  },
}

export default meta

type Story = StoryObj<typeof ClientDashboard>

export const Default: Story = {
  render: function RenderClientDashboard(args) {
    return (
      <div className="bg-beige p-15">
        <ClientDashboard {...args} />
      </div>
    )
  },
  args: {
    client: mockClients[0],
    projects: mockProjects1,
  },
}
