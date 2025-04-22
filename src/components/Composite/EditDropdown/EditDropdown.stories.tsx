import React from 'react'
import { Meta, StoryObj, StoryFn } from '@storybook/react'
import EditDropdown from './EditDropdown'

const meta: Meta<typeof EditDropdown> = {
  title: 'Composite/EditDropdown',
  component: EditDropdown,
  decorators: [
    (Story: StoryFn) => (
      <div className="p-4 bg-beige h-10 w-50 flex items-center justify-end rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EditDropdown>

export const Default: Story = {
  args: {
    className: '',
    containerWidth: 200,
    onEdit: () => {
      console.log('edit')
    },
    onDelete: () => {
      console.log('delete')
    },
  },
}
