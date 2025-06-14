import type { Meta, StoryObj } from '@storybook/react'
import RadialMenu from './RadialMenu'
import { FiPrinter, FiSave } from 'react-icons/fi'
import { HiOutlineDocumentDownload } from 'react-icons/hi'

const meta: Meta<typeof RadialMenu> = {
  title: 'Composite/RadialMenu',
  component: RadialMenu,
  tags: ['autodocs'],
  argTypes: {
    onItemClick: { action: 'item clicked' },
  },
}

export default meta

type Story = StoryObj<typeof RadialMenu>

export const Default: Story = {
  render: (args) => (
    <div className="relative w-full h-screen flex justify-center items-center">
      <RadialMenu {...args} />
    </div>
  ),
  args: {
    items: [
      { Icon: FiSave, value: 'save', label: 'Save', isLoading: false},
      { Icon: FiPrinter, value: 'publish', label: 'Publish', isLoading: false},
      { Icon: HiOutlineDocumentDownload, value: 'downloadcsv', label: 'Download CSV', isLoading: false},
    ],
  },
}
