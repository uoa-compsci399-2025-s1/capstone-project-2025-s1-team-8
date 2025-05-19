import type { Meta, StoryObj } from '@storybook/react'
import ProjectContainer from './ProjectContainer'
import { DndContext } from '@dnd-kit/core'
import { FilterProvider } from '@/contexts/FilterContext'
import { projectMock, projectMock2 } from '@/test-config/mocks/Project.mock'
import type { SortableKeys } from '@/components/Generic/Filter/ProjectFilterAssets'
import { useState } from 'react'

export default {
  title: 'Composite/ProjectContainer',
  component: ProjectContainer,
  decorators: [
    (Story) => {
      const [selectedFilter, setSelectedFilter] = useState<SortableKeys | undefined>(
        'originalOrder',
      )

      return (
        <DndContext>
          <FilterProvider
            value={{
              selectedFilter: selectedFilter,
              setSelectedFilter: setSelectedFilter,
            }}
          >
            <Story />
          </FilterProvider>
        </DndContext>
      )
    },
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
        projectInfo: projectMock,
      },
      {
        id: 'proj-2',
        projectInfo: projectMock2,
      },
    ],
    onChange: () => {},
  },
}
