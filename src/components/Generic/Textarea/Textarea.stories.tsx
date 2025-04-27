import type { Meta, StoryObj } from '@storybook/react'
import Input from './Textarea'

const meta: Meta<typeof Input> = {
  title: 'Generic/Textarea',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}
