import type { Meta, StoryObj } from '@storybook/react'
import ClientsPage from './ClientsPage'
import { mockClients } from '@/test-config/mocks/User.mock'

const mockClientsWithProjects = mockClients.map((c) => ({
  client: c,
  projects: [],
}))

const meta: Meta<typeof ClientsPage> = {
  title: 'Pages/ClientsPage',
  component: ClientsPage,
  tags: ['autodocs'],
  args: {
    clients: mockClientsWithProjects,
  },
}

export default meta

type Story = StoryObj<typeof ClientsPage>

export const Default: Story = {
  render: function RenderClientsPage(args) {
    return (
      <div className="bg-beige p-15">
        <ClientsPage {...args} />
      </div>
    )
  },
  args: {
    clients: mockClientsWithProjects,
  },
}
