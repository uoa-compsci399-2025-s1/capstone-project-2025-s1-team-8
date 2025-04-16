import React from 'react';
import { Meta, StoryObj, StoryFn } from '@storybook/react';
import ProjectFilter from './ProjectFilter';
import { FilterProvider } from '@/contexts/FilterContext'; // adjust the import if needed

const meta: Meta<typeof ProjectFilter> = {
  title: 'Components/Filter/ProjectFilter',
  component: ProjectFilter,
  decorators: [
    (Story: StoryFn) => (
      <FilterProvider>
        <div className="p-4 bg-beige h-10 w-50 flex items-center justify-end rounded-lg">
          <Story />
        </div>
      </FilterProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectFilter>;

export const Default: Story = {
  args: {
    className: '',
    containerWidth: 300,
  },
};