import type { Meta, StoryObj } from '@storybook/react'
import ClientDashboard from './ClientDashboard'
import { clientMocks as mockClients } from '@/test-config/mocks/User.mock'
import { projectsWithSemestersMock } from '@/test-config/mocks/Project.mock'

const meta: Meta<typeof ClientDashboard> = {
  title: 'Pages/ClientDashboard',
  component: ClientDashboard,
  tags: ['autodocs'],
  args: {
    client: mockClients[0],
    projects: projectsWithSemestersMock,
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
    projects: projectsWithSemestersMock,
  },
}
