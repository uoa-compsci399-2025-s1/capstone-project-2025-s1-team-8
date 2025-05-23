import type { Meta, StoryObj } from '@storybook/react'
import ClientProfile from './ClientProfile'
import { mockClients } from '@/test-config/mocks/User.mock'

const meta: Meta<typeof ClientProfile> = {
  component: ClientProfile,
  title: 'Composite/ClientProfile',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientProfile>

export const Default: Story = {
  args: {
    clientInfo: mockClients[0],
  },
}
