import type { Meta, StoryObj } from '@storybook/react'
import ClientDashboard from './ClientDashboard'
import { clientMocks as mockClients } from '@/mocks/newClients.mock'
import { mockProjects } from '@/mocks/newProjects.mock'

const meta: Meta<typeof ClientDashboard> = {
  title: 'Pages/ClientDashboard',
  component: ClientDashboard,
  tags: ['autodocs'],
  args: {
    client: mockClients[0],
    projects: mockProjects,
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
    projects: mockProjects,
  },
}
