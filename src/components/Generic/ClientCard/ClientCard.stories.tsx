import type { Meta, StoryObj } from '@storybook/react'
import ClientCard from './ClientCard'
import { ClientDTOPlaceholder } from './ClientCard'
import { mockClients } from '@/mocks/Clients.mock'

const meta: Meta<typeof ClientCard> = {
  component: ClientCard,
  title: 'Generic/ClientCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientCard>

export const Default: Story = {
  args: {
    ...mockClients[0],
  },
}
