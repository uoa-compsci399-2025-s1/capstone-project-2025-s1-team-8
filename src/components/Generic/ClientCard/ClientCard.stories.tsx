import type { Meta, StoryObj } from '@storybook/react'
import ClientCard from './ClientCard'
import { mockClients } from '@/test-config/mocks/User.mock'
import { projectDetailsListMock } from '@/test-config/mocks/Project.mock'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ProjectDetails } from '@/types/Project'
import { QueryClientDecorator } from '@/utils/storybookProvider'

const meta: Meta<typeof ClientCard> = {
  component: ClientCard,
  title: 'Generic/ClientCard',
  tags: ['autodocs'],
  decorators: [QueryClientDecorator],
}

export default meta

type Story = StoryObj<typeof ClientCard>

export const Default: Story = {
  args: {
    clientInfo: mockClients[0],
    projects: projectDetailsListMock,
    useClientProjects: (id) => {
      console.log(`Client projects fetch called on ID: ${id}`)
      return {} as unknown as UseQueryResult<ProjectDetails[], Error>
    },
  },
}
