import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import ProjectFilter from './ProjectFilter'
import { FilterProvider } from '@/contexts/FilterContext' // adjust the import if needed
import { SortableKeys } from '@/components/Generic/Filter/ProjectFilterAssets'

const meta: Meta<typeof ProjectFilter> = {
  title: 'Composite/ProjectFilter',
  component: ProjectFilter,
  decorators: [
    (Story) => (
      <FilterProvider
        value={{
          selectedFilter: undefined,
          setSelectedFilter: function (filter: SortableKeys): void {
            throw new Error('Function not implemented.')
          },
        }}
      >
        <div className="p-4 bg-beige h-10 w-50 flex items-center justify-end rounded-lg">
          <Story />
        </div>
      </FilterProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProjectFilter>

export const Default: Story = {
  args: {
    className: '',
    containerWidth: 300,
  },
}
