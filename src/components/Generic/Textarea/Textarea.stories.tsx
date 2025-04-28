import type { Meta, StoryObj } from '@storybook/react'
import Textarea from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Generic/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}
