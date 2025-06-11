import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import EditDeleteDropdown from './EditDeleteDropdown'

const meta: Meta<typeof EditDeleteDropdown> = {
  title: 'Composite/EditDropdown',
  component: EditDeleteDropdown,
  decorators: [
    (Story) => (
      <div className="p-4 bg-steel-blue h-10 w-50 flex items-center justify-end rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof EditDeleteDropdown>

export const Default: Story = {
  args: {
    className: '',
    containerWidth: 500,
    onEdit: () => {
      console.log('edit')
    },
    onDelete: () => {
      console.log('delete')
    },
  },
}
