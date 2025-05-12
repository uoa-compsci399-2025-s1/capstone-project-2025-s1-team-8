import type { Meta, StoryObj } from '@storybook/react'
import ClientGroup from './ClientGroup'
import { clientMocks } from '@/mocks/clients.mock'

const meta: Meta<typeof ClientGroup> = {
  component: ClientGroup,
  title: 'Composite/ClientGroup',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientGroup>

export const Default: Story = {
  args: {
    clients: clientMocks,
  },
}
