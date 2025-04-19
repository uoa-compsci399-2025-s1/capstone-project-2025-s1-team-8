import type { Meta, StoryObj } from '@storybook/react'
import ClientCard from './ClientCard'
import { ClientDTOPlaceholder } from './ClientCard'

const meta: Meta<typeof ClientCard> = {
  component: ClientCard,
  title: 'Generic/ClientCard',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientCard>

const mockClient: ClientDTOPlaceholder = {
  name: 'David Cumin',
  email: 'davidcumin@gmail.com',
  affiliation: 'University of Auckland',
  introduction:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  projects: [
    {
      name: 'Chronobiology',
      client: 'David Cumin',
      description: 'A web based laboratory for visualisation and analysis of data.',
    },
  ],
}

export const Default: Story = {
  args: {
    ...mockClient,
  },
}
