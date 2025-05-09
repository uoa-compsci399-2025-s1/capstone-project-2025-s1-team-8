import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import RadialMenuItem from './RadialMenuItem'
import { FiPrinter, FiSave } from 'react-icons/fi'
import { HiOutlineDocumentDownload } from 'react-icons/hi'

const meta: Meta<typeof RadialMenuItem> = {
  title: 'Generic/RadialMenuItem',
  component: RadialMenuItem,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof RadialMenuItem>

export const SingleItem: Story = {
  render: (args) => (
    <div className="relative w-full h-screen flex justify-center items-center">
      <RadialMenuItem
        {...args}
        Icon={FiSave}
        label="Save"
        index={0}
        totalItems={3}
        onClick={() => {}}
      />
    </div>
  ),
  args: {},
}

export const ThreeItems: Story = {
  render: (args) => (
    <div className="relative w-full h-screen flex justify-center items-center">
      <RadialMenuItem
        {...args}
        Icon={FiSave}
        label="Save"
        index={0}
        totalItems={3}
        onClick={() => {}}
      />
      <RadialMenuItem
        {...args}
        Icon={FiPrinter}
        label="Publish"
        index={1}
        totalItems={3}
        onClick={() => {}}
      />
      <RadialMenuItem
        {...args}
        Icon={HiOutlineDocumentDownload}
        label="Download CSV"
        index={2}
        totalItems={3}
        onClick={() => {}}
      />
    </div>
  ),
  args: {},
}
