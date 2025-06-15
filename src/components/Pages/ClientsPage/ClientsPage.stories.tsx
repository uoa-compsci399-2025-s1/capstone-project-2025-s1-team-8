import type { Meta, StoryObj } from '@storybook/react'
import ClientsPage from './ClientsPage'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ClientsData } from '@/lib/hooks/useClients'
import { QueryClientDecorator } from '@/utils/storybookProvider'

const meta: Meta<typeof ClientsPage> = {
  title: 'Pages/ClientsPage',
  component: ClientsPage,
  tags: ['autodocs'],
  decorators: [QueryClientDecorator],
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
    onDeleteClient: async (clientId: string) => {
      console.log('Update client:', clientId)
      return {}
    },
    useClients: (page: number, search: string) => {
      console.log(`Page: ${page}, Search: ${search}`)
      return {} as UseQueryResult<ClientsData, Error>
    },
  },
}
