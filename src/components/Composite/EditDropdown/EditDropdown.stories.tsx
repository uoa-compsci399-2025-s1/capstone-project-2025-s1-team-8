import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import EditDropdown from './EditDropdown'

const meta: Meta<typeof EditDropdown> = {
  title: 'Composite/EditDropdown',
  component: EditDropdown,
  decorators: [
    (Story) => (
      <div className="p-4 bg-steel-blue h-10 w-50 flex items-center justify-end rounded-lg">
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
    containerWidth: 500,
    onEdit: () => {
      console.log('edit')
    },
    onDelete: () => {
      console.log('delete')
    },
  },
}
