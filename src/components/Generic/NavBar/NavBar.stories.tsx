import type { Meta, StoryObj } from '@storybook/react'
import NavBar from './NavBar'
import { mockClients } from '@/test-config/mocks/User.mock'

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Generic/NavBar',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof NavBar>

export const Default: Story = {
  args: {},
}

export const AdditionalLink: Story = {
  args: {
    navElements: [{ href: '/', text: 'My Dashboard' }],
  },
}

export const LoggedIn: Story = {
  args: {
    user: mockClients[0],
  },
}
