import type { Meta, StoryObj } from '@storybook/react'
import ClientGroup from './ClientGroup'
import { mockClients } from '@/test-config/mocks/User.mock'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ProjectDetails } from '@/types/Project'
import { QueryClientDecorator } from '@/utils/storybookProvider'

const meta: Meta<typeof ClientGroup> = {
  component: ClientGroup,
  title: 'Composite/ClientGroup',
  tags: ['autodocs'],
  decorators: [QueryClientDecorator],
}

export default meta

const mockClientsWithProjects = mockClients.map((client) => ({
  client,
  projects: [],
}))

type Story = StoryObj<typeof ClientGroup>

export const Default: Story = {
  args: {
    clients: mockClientsWithProjects,
    useClientProjects: (id: string) => {
      console.log(`Client ID: ${id}`)
      return { data: [], isLoading: false } as unknown as UseQueryResult<ProjectDetails[], Error>
    },
  },
}
