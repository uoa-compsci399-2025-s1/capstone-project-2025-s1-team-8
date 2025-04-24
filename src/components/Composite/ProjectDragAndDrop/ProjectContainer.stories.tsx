import { Meta, StoryObj } from '@storybook/react'
import ProjectContainer from './ProjectContainer'
import { DndContext } from '@dnd-kit/core'
import { FilterProvider } from '@/contexts/FilterContext'
import { mockProjects } from '@/mocks/Projects.mock'
import { SortableKeys } from '@/components/Generic/Filter/ProjectFilterAssets'

export default {
  title: 'Composite/ProjectContainer',
  component: ProjectContainer,
  decorators: [
    (Story) => (
      <DndContext>
        <FilterProvider
          value={{
            selectedFilter: undefined,
            setSelectedFilter: function (filter: SortableKeys): void {
              throw new Error('Function not implemented.')
            },
          }}
        >
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
        projectInfo: mockProjects[0],
      },
      {
        id: 'proj-2',
        projectInfo: mockProjects[1],
      },
    ],
    onChange: () => {},
  },
}
