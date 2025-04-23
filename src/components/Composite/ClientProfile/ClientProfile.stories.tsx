import type { Meta, StoryObj } from '@storybook/react'
import ClientProfile from './ClientProfile'
import { ClientDTOPlaceholder } from '@/components/Generic/ClientCard/ClientCard'

const mockClient: ClientDTOPlaceholder =
    {
      name: 'David Cumin',
      email: 'davidcumin@gmail.com',
      affiliation: 'University of Auckland',
      introduction:
        'Hello! My name is John Doe and I am a lecturer at the University of Auckland. \n\nMy hobbies include snorkelling, fishing, reading, baking, eating, sleeping and taking various methods of transport to my destination! FIRE \n\nJohn Doe is a common placeholder name used to represent an unknown or anonymous individual, particularly in legal or informal contexts. It\'s often used as a stand-in when a person\'s real name is not known, needs to be protected, or when a general example is needed. The female equivalent is "Jane Doe". ',
      projects: [
        {
          name: 'Chronobiology',
          client: 'David Cumin',
          description: 'A web based laboratory for visualisation and analysis of data.',
        },
      ],
    }

const meta: Meta<typeof ClientProfile> = {
  component: ClientProfile,
  title: 'Composite/ClientProfile',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ClientProfile>

export const Default: Story = {
  args: {
    clientInfo: mockClient,
  },
}
