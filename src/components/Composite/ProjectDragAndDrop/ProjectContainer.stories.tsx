import { Meta, StoryObj } from '@storybook/react'
import ProjectContainer from './ProjectContainer'
import { DndContext } from '@dnd-kit/core'
import { FilterProvider } from '@/contexts/FilterContext'
import { mockProjects1 } from '@/mocks/Projects.mock'

export default {
  title: 'Composite/ProjectContainer',
  component: ProjectContainer,
  decorators: [
    (Story) => (
      <DndContext>
        <FilterProvider>
          <Story />
        </FilterProvider>
      </DndContext>
    ),
  ],
} as Meta

type Story = StoryObj<typeof ProjectContainer>

export const Default: Story = {
  args: {
    id: 'container-1',
    containerName: 'Drafts',
    containerColor: 'light',
    projects: [
      {
        id: 'proj-1',
        projectInfo: mockProjects1[0],
      },
      {
        id: 'proj-2',
        projectInfo: mockProjects1[1],
      },
    ],
    onChange: () => {},
  },
}
