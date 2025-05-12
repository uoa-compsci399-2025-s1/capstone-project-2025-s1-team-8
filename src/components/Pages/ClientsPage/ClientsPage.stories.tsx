import type { Meta, StoryObj } from '@storybook/react'
import ClientsPage from './ClientsPage'
import { clientMocks as mockClients } from '@/mocks/clients.mock'

const meta: Meta<typeof ClientsPage> = {
  title: 'Pages/ClientsPage',
  component: ClientsPage,
  tags: ['autodocs'],
  args: {
    clients: mockClients,
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
    clients: mockClients,
  },
}
