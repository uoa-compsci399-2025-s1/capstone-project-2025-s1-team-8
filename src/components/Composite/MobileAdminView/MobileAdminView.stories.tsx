import type { Meta, StoryObj } from '@storybook/react'
import { mockClients } from '@/test-config/mocks/User.mock'
import MobileAdminView from './MobileAdminView'

const meta: Meta<typeof MobileAdminView> = {
  component: MobileAdminView,
  title: 'Composite/MobileAdminView',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof MobileAdminView>

export const Default: Story = {
  args: {
    clientInfo: mockClients[0],
  },
}
