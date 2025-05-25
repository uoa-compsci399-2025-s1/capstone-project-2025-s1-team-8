import type { Meta, StoryObj } from '@storybook/react'
import type { options } from './Checkbox'
import Checkbox from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Generic/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    options: [
      {
        value: 'option1',
        label: 'Option 1',
      },
      {
        value: 'option2',
        label: 'Option 2',
      },
      {
        value: 'option3',
        label: 'Option 3',
      },
    ] as options[],
  },
}
